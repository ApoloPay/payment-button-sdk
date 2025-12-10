import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@payment-button-sdk/svelte': path.resolve(__dirname, '../../packages/svelte/src/lib/index.ts'),
      '@payment-button-sdk/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@payment-button-sdk/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    }
  }
})
