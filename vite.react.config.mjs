import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  root: "app",
  publicDir: "public",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./app/src", import.meta.url))
    },
    dedupe: ["react", "react-dom"]
  },
  server: {
    host: "0.0.0.0",
    port: 5173
  },
  preview: {
    host: "0.0.0.0",
    port: 4173
  },
  build: {
    outDir: "../output/react-overhaul",
    emptyOutDir: true,
    sourcemap: true
  }
});
