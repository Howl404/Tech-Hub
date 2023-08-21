import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import * as path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      'node-fetch': 'isomorphic-fetch',
      '@src': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@interfaces': path.resolve(__dirname, './src/interfaces'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
});
