import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@apolopay-sdk/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@apolopay-sdk/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    }
  }
});