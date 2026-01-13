import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [preact()],
  build: {
    outDir: '../api/public',
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    proxy: {
      '/rpc': 'http://localhost:3000',
    },
  },
});
