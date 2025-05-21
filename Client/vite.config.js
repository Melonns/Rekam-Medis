// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
<<<<<<< Updated upstream
      '/api/data': { // Ubah path prefix proxy menjadi /api/data
        target: 'server-production-bb65.up.railway.app',
=======
      '/api': {
        target: 'http://localhost:3000',
>>>>>>> Stashed changes
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // ✅ HANYA ini yang perlu
      },
    },
  },
});
