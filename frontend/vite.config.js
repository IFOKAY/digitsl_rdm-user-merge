import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      input: '/Users/psandeep/Downloads/project 3/src/main.jsx', // Explicitly set the entry point
    },
  },
  server: {
    proxy: {
      '/api': {
      target: 'http://localhost:8082', // <-- use your real backend URL
        changeOrigin: true,
        secure: false,
      }
    }
  }
});