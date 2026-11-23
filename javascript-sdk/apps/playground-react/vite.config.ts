import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@nexora-smartpay/react': path.resolve(__dirname, '../../packages/react/src/index.tsx'),
      '@nexora-smartpay/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@nexora-smartpay/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    }
  }
})
