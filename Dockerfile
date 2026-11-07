# 1) Build du frontend React
FROM node:22-alpine AS web
WORKDIR /web
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npx vite build --outDir /web/dist --emptyOutDir

# 2) Build du backend Spring Boot (avec le frontend dans static/)
FROM maven:3.9-eclipse-temurin-17 AS api
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
COPY --from=web /web/dist ./src/main/resources/static
RUN mvn -q -B -DskipTests package

# 3) Image finale
FROM eclipse-temurin:17-jre
COPY --from=api /app/target/goodbooks-1.0.0.jar /app.jar
ENV PORT=8080
EXPOSE 8080
CMD ["java", "-jar", "/app.jar"]
