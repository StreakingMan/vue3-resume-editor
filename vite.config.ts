import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vuetify from 'vite-plugin-vuetify';
import { VitePluginRadar } from 'vite-plugin-radar';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vuetify({
            autoImport: true,
        }),
        VitePluginRadar({
            microsoftClarity: {
                id: 'sjq6mx3ulp',
            },
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
});
