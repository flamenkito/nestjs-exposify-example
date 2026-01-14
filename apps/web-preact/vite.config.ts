import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [preact()],
  base: '/preact/',
  build: {
    outDir: '../../dist/web-preact',
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    proxy: {
      '/rpc': 'http://localhost:3000',
    },
  },
});
