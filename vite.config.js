import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2018',
    cssTarget: 'safari13',
  },
  esbuild: {
    target: 'es2018',
  },
});
