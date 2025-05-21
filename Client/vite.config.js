// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'serverrekammedis',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // ✅ HANYA ini yang perlu
      },
    },
  },
});
