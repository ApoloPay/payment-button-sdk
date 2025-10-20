import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/package').Config} */
const config = {
  // Usa vitePreprocess para manejar TypeScript dentro de <script lang="ts">
  preprocess: vitePreprocess(),

  kit: {
    // Apunta a la carpeta 'src/lib'
    files: {
      lib: 'src/lib',
    },
  },
};

export default config;