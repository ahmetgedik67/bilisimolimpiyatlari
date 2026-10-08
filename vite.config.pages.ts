import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

/**
 * GitHub Pages (bilfen.github.io/bilimolimpiyatlari) statik derleme yapılandırması.
 * TÜM istemciyi (ana sayfa + tüm rotalar) sunucu olmadan derler; API çağrıları
 * Pages'te zarif şekilde düşer (ziyaretçi modu).
 */
const PROJECT_ROOT = import.meta.dirname;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(PROJECT_ROOT, "client", "src"),
      "@shared": path.resolve(PROJECT_ROOT, "shared"),
      "@assets": path.resolve(PROJECT_ROOT, "attached_assets"),
    },
  },
  envDir: path.resolve(PROJECT_ROOT),
  root: path.resolve(PROJECT_ROOT, "client"),
  publicDir: path.resolve(PROJECT_ROOT, "client", "public"),
  base: "/bilimolimpiyatlari/",
  build: {
    outDir: path.resolve(PROJECT_ROOT, "dist-pages"),
    emptyOutDir: true,
  },
});
