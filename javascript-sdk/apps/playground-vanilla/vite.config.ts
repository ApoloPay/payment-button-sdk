import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@payment-button-sdk/ui': path.resolve(__dirname, 
        '../../packages/ui/src/index.ts'
      ),
    }
  }
});