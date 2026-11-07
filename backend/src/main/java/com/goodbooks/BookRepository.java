package com.goodbooks;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Repository;

/** Charge books_clean.csv en mémoire au démarrage. */
@Repository
public class BookRepository {

    private final List<Book> books;

    public BookRepository() throws IOException {
        CSVFormat format = CSVFormat.DEFAULT.builder().setHeader().setSkipHeaderRecord(true).build();
        try (InputStreamReader in = new InputStreamReader(
                new ClassPathResource("data/books_clean.csv").getInputStream(), StandardCharsets.UTF_8)) {
            books = format.parse(in).stream().map(BookRepository::toBook).toList();
        }
    }

    private static Integer intOrNull(String s) {
        return (s == null || s.isBlank()) ? null : (int) Double.parseDouble(s);
    }

    private static Book toBook(CSVRecord r) {
        String lang = r.get("language_code");
        if (lang == null || lang.isBlank()) lang = "unknown";
        if (lang.startsWith("en")) lang = "eng";
        return new Book(
                Integer.parseInt(r.get("book_id")),
                r.get("title"),
                r.get("main_author"),
                intOrNull(r.get("year")),
                intOrNull(r.get("decade")),
                lang,
                Double.parseDouble(r.get("average_rating")),
                (long) Double.parseDouble(r.get("ratings_count")),
                r.get("main_genre"));
    }

    public List<Book> all() {
        return books;
    }

    public Optional<Book> byId(int id) {
        return books.stream().filter(b -> b.bookId() == id).findFirst();
    }
}
