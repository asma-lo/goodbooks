package com.goodbooks;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
public class BookService {

    public record Point(String label, Number value) { }
    public record Stats(int books, long votes, Double avgRating) { }
    public record Filters(List<String> genres, List<String> languages, List<Integer> decades) { }
    public record Page(long total, int page, int size, List<Book> items) { }

    private final BookRepository repo;

    public BookService(BookRepository repo) {
        this.repo = repo;
    }

    private static boolean blank(String s) {
        return s == null || s.isBlank();
    }

    public List<Book> filter(BookFilter f) {
        String needle = blank(f.q()) ? "" : f.q().toLowerCase().trim();
        return repo.all().stream()
                .filter(b -> blank(f.genre()) || b.mainGenre().equals(f.genre()))
                .filter(b -> blank(f.language()) || b.languageCode().equals(f.language()))
                .filter(b -> f.decade() == null || f.decade().equals(b.decade()))
                .filter(b -> needle.isEmpty()
                        || b.title().toLowerCase().contains(needle)
                        || b.mainAuthor().toLowerCase().contains(needle))
                .toList();
    }

    public Filters filters() {
        List<Book> all = repo.all();
        return new Filters(
                all.stream().map(Book::mainGenre).distinct().sorted().toList(),
                all.stream().map(Book::languageCode).distinct().sorted().toList(),
                all.stream().map(Book::decade).filter(d -> d != null && d >= 1800).distinct().sorted().toList());
    }

    public Stats stats(BookFilter f) {
        List<Book> list = filter(f);
        long votes = list.stream().mapToLong(Book::ratingsCount).sum();
        double weighted = list.stream().mapToDouble(b -> b.averageRating() * b.ratingsCount()).sum();
        Double avg = votes == 0 ? null : Double.valueOf(Math.round(weighted / votes * 100) / 100.0);
        return new Stats(list.size(), votes, avg);
    }

    private static List<Point> top(Map<String, Long> m, int limit) {
        return m.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(limit)
                .map(e -> new Point(e.getKey(), e.getValue()))
                .toList();
    }

    public List<Point> genres(BookFilter f) {
        return top(filter(f).stream().collect(
                Collectors.groupingBy(Book::mainGenre, Collectors.counting())), Integer.MAX_VALUE);
    }

    public List<Point> languages(BookFilter f) {
        return top(filter(f).stream().collect(
                Collectors.groupingBy(Book::languageCode, Collectors.counting())), 8);
    }

    public List<Point> authors(BookFilter f) {
        return top(filter(f).stream().collect(
                Collectors.groupingBy(Book::mainAuthor, Collectors.summingLong(Book::ratingsCount))), 10);
    }

    public List<Point> decades(BookFilter f) {
        TreeMap<Integer, Double> avg = filter(f).stream()
                .filter(b -> b.decade() != null && b.decade() >= 1900)
                .collect(Collectors.groupingBy(Book::decade, TreeMap::new,
                        Collectors.averagingDouble(Book::averageRating)));
        return avg.entrySet().stream()
                .map(e -> new Point(e.getKey() + "s", Math.round(e.getValue() * 100) / 100.0))
                .toList();
    }

    public Page books(BookFilter f, String sort, String order, int page, int size) {
        int p = Math.max(1, page);
        int s = Math.min(100, Math.max(1, size));
        Comparator<Book> c = switch (sort) {
            case "averageRating" -> Comparator.comparingDouble(Book::averageRating);
            case "year" -> Comparator.comparing(Book::year, Comparator.nullsFirst(Comparator.<Integer>naturalOrder()));
            case "title" -> Comparator.comparing((Book b) -> b.title().toLowerCase());
            default -> Comparator.comparingLong(Book::ratingsCount);
        };
        if (!"asc".equals(order)) c = c.reversed();
        List<Book> list = filter(f).stream().sorted(c).toList();
        int from = Math.min(list.size(), (p - 1) * s);
        return new Page(list.size(), p, s, list.subList(from, Math.min(list.size(), from + s)));
    }
}
