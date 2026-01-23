import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@apolopay-sdk/react': path.resolve(__dirname, '../../packages/react/src/index.tsx'),
      '@apolopay-sdk/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@apolopay-sdk/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
    }
  }
})
