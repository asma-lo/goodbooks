package com.goodbooks;

public record Book(int bookId, String title, String mainAuthor, Integer year, Integer decade,
                   String languageCode, double averageRating, long ratingsCount, String mainGenre) {
}
