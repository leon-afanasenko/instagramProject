import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
   server: 
    { host: true, port: 5173 },
  plugins: [react()],
  resolve: {
    alias: {
      'i18next': path.resolve(__dirname, 'node_modules/i18next'),
    },
  },
});
