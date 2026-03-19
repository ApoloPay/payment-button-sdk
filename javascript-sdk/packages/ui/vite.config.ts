import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ApoloPaySDK',
      fileName: (format) => `apolopay-sdk.${format}.js`,
    },
    rollupOptions: {
      external: [], 
      output: {
        globals: {}
      }
    },
    minify: 'esbuild', 
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});