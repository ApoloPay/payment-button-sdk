import { defineConfig, type Plugin } from 'vite';
import { resolve } from 'path';

/** Global name exposed by the UMD bundle (`window.NexoraSmartPay`). */
const GLOBAL_NAME = 'NexoraSmartPay';
/** Pre-rename global name, kept as a deprecated alias for existing script-tag integrations. */
const LEGACY_GLOBAL_NAME = 'ApoloPaySDK';

/**
 * Appends `window.ApoloPaySDK = window.NexoraSmartPay` to the UMD bundle only, so merchants
 * (and the WordPress plugin) that still read the old global keep working.
 */
function legacyGlobalAlias(): Plugin {
  return {
    name: 'smartpay-legacy-global-alias',
    apply: 'build',
    generateBundle(options, bundle) {
      if (options.format !== 'umd') return;
      for (const chunk of Object.values(bundle)) {
        if (chunk.type !== 'chunk' || !chunk.isEntry) continue;
        chunk.code +=
          `\n;(function(g){if(g&&g.${GLOBAL_NAME}&&!g.${LEGACY_GLOBAL_NAME}){g.${LEGACY_GLOBAL_NAME}=g.${GLOBAL_NAME};}})(typeof globalThis!=="undefined"?globalThis:typeof self!=="undefined"?self:undefined);\n`;
      }
    },
  };
}

export default defineConfig({
  plugins: [legacyGlobalAlias()],
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: GLOBAL_NAME,
      fileName: (format) => `nexora-smartpay.${format}.js`,
    },
    rollupOptions: {
      external: [], 
      output: {
        globals: {}
      }
    },
    minify: 'esbuild', 
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
