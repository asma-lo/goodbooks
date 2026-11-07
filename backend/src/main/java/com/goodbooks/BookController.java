package com.goodbooks;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class BookController {

    private final BookService service;
    private final BookRepository repo;

    public BookController(BookService service, BookRepository repo) {
        this.service = service;
        this.repo = repo;
    }

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of("status", "ok", "books", repo.all().size());
    }

    @GetMapping("/filters")
    public BookService.Filters filters() {
        return service.filters();
    }

    @GetMapping("/stats")
    public BookService.Stats stats(BookFilter f) {
        return service.stats(f);
    }

    @GetMapping("/genres")
    public List<BookService.Point> genres(BookFilter f) {
        return service.genres(f);
    }

    @GetMapping("/languages")
    public List<BookService.Point> languages(BookFilter f) {
        return service.languages(f);
    }

    @GetMapping("/decades")
    public List<BookService.Point> decades(BookFilter f) {
        return service.decades(f);
    }

    @GetMapping("/authors")
    public List<BookService.Point> authors(BookFilter f) {
        return service.authors(f);
    }

    @GetMapping("/books")
    public BookService.Page books(BookFilter f,
                                  @RequestParam(defaultValue = "ratingsCount") String sort,
                                  @RequestParam(defaultValue = "desc") String order,
                                  @RequestParam(defaultValue = "1") int page,
                                  @RequestParam(defaultValue = "10") int size) {
        return service.books(f, sort, order, page, size);
    }

    @GetMapping("/books/{id}")
    public Book book(@PathVariable int id) {
        return repo.byId(id).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Livre introuvable"));
    }
}
