import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Konfigurasi Vitest berbagi dengan Vite agar tidak perlu file terpisah.
// Test memakai environment jsdom karena komponen memakai DOM API.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5174,
    open: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    css: false,
    // Mempercepat test: tidak perlu meng-scan ulang modul yang sama antar file.
    restoreMocks: true,
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx', 'src/setupTests.js', 'src/__tests__/**'],
    },
  },
});