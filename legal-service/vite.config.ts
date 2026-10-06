import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/legal/',
  plugins: [react()],
  resolve: {
    alias: {
      '@shared/i18n': path.resolve(__dirname, '../shared/i18n/index.ts'),
      '@shared/types': path.resolve(__dirname, '../shared/types/index.ts'),
      '@shared': path.resolve(__dirname, '../shared'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3003,
    host: '0.0.0.0',
    fs: {
      allow: ['..'],
    },
  },
});
