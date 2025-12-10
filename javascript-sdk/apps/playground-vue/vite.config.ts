import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@payment-button-sdk/vue': path.resolve(__dirname, '../../packages/vue/src/index.tsx'),
      '@payment-button-sdk/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@payment-button-sdk/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    }
  }
})
