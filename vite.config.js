import { defineConfig } from 'vite';

// Rutas relativas: el mismo build funciona en GitHub Pages (/SurTec_Web/),
// en local y abierto desde una carpeta en la feria.
export default defineConfig({
  base: './',
  build: {
    target: 'es2020',
    assetsInlineLimit: 4096,
    chunkSizeWarningLimit: 700,
  },
  server: {
    port: 5173,
    host: true,
  },
});
