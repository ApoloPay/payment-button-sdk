import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@nexora-smartpay/svelte': path.resolve(__dirname, '../../packages/svelte/src/lib/index.ts'),
      '@nexora-smartpay/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@nexora-smartpay/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    }
  }
})
