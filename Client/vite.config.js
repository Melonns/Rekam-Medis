// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/data': { // Ubah path prefix proxy menjadi /api/data
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/data/, '/data'), // Rewrite /api/data menjadi /data
      },
    },
  },
});