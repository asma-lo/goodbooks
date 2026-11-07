package com.goodbooks;

/** Filtres communs à tous les endpoints (liés aux paramètres de l'URL). */
public record BookFilter(String genre, String language, Integer decade, String q) {
}
