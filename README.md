# Goodbooks

![CI](https://github.com/asma-lo/goodbooks/actions/workflows/ci.yml/badge.svg)
![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)

Application web pour explorer le jeu de données **Goodbooks-10k** (10 000 livres) :
une **étagère interactive** (hauteur = note, largeur = votes, couleur = genre), des filtres,
des **diagrammes circulaires cliquables**, des graphiques animés et une API REST.

## Interface
- Fond aurore animé et cartes en verre dépoli (glassmorphism)
- Compteurs animés, livres qui « poussent » sur l’étagère, graphiques qui s’animent au défilement
- Diagrammes circulaires : clic sur une part du genre = filtre instantané
- Fiche détaillée avec note animée
- Respecte la préférence système « réduire les animations »

## Stack
- **Backend et API** : Java 17, Spring Boot 3 (Spring Web), Apache Commons CSV
- **Frontend** : React 18, Vite, Recharts
- **Données** : `books_clean.csv` (nettoyé avec pandas dans un notebook Kaggle)
- **Qualité** : tests JUnit / MockMvc, GitHub Actions, Docker

## Structure
```
backend/                       Spring Boot
  src/main/java/com/goodbooks  Book, BookRepository, BookService, BookController
  src/main/resources/data      books_clean.csv
  src/main/resources/static    interface React compilée (servie par Spring Boot)
  src/test/java                tests de l'API
frontend/                      React (code source)
  src/components               Filters, Shelf, Charts, BookTable, BookDrawer
```

## Lancer l'application
**Avec IntelliJ** : ouvrir le dossier `backend` (File > Open, choisir `pom.xml`), attendre le
chargement Maven, puis exécuter `GoodbooksApplication`. Ouvrir http://localhost:8080.

**En ligne de commande** (JDK 17+ et Maven) :
```
cd backend
mvn spring-boot:run
```

## Développer le frontend (Node.js 20+)
```
cd frontend
npm install
npm run dev        # http://localhost:5173, appels /api redirigés vers le port 8080
npm run build      # compile dans backend/src/main/resources/static
```

## API
| Route | Description |
|---|---|
| `GET /api/health` | État du service |
| `GET /api/filters` | Genres, langues et décennies disponibles |
| `GET /api/stats` | Nombre de livres, votes, note moyenne pondérée |
| `GET /api/genres`, `/languages`, `/decades`, `/authors` | Données des graphiques |
| `GET /api/books` | Liste paginée (`sort`, `order`, `page`, `size`) |
| `GET /api/books/{id}` | Détail d'un livre |

Filtres communs : `genre`, `language`, `decade`, `q` (recherche titre ou auteur).
`sort` : `ratingsCount`, `averageRating`, `year`, `title`.

## Tests
```
cd backend
mvn test
```

## Docker
```
docker build -t goodbooks .
docker run -p 8080:8080 goodbooks
```

## Licence
MIT
