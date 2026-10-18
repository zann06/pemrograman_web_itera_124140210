import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' membuat semua asset relatif sehingga hasil build tetap bisa dibuka
// dari subfolder GitHub Pages maupun dari file system tanpa konfigurasi rewrite.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
});