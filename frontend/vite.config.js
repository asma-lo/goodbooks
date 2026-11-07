import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En développement : les appels /api sont envoyés au serveur Spring Boot (port 8080).
// En production : le build est copié dans le dossier static de Spring Boot.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:8080" } },
  build: { outDir: "../backend/src/main/resources/static", emptyOutDir: true },
});
