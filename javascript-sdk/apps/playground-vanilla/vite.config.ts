import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@nexora-smartpay/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@nexora-smartpay/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    }
  }
});