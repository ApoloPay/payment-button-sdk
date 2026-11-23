import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            '@nexora-smartpay/vue': path.resolve(__dirname, '../../packages/vue/src/index.tsx'),
            '@nexora-smartpay/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
            '@nexora-smartpay/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
        }
    }
});
