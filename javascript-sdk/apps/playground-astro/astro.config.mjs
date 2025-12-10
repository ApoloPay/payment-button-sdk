import { defineConfig } from 'astro/config';
import { fileURLToPath, URL } from 'node:url';

// https://astro.build/config
export default defineConfig({
  
  vite: {
    resolve: {
      alias: [
        {
          find: '@payment-button-sdk/astro',
          replacement: fileURLToPath(new URL(
            '../../packages/astro/src',
            import.meta.url
          )),
        },
        {
          find: '@payment-button-sdk/ui',
          replacement: fileURLToPath(new URL(
            '../../packages/ui/src/index.ts',
            import.meta.url
          )),
        },
        {
          find: '@payment-button-sdk/core',
          replacement: fileURLToPath(new URL(
            '../../packages/core/src/index.ts',
            import.meta.url
          )),
        }
      ]
    }
  }
});