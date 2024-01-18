import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import { loadFonts } from './plugins/webfontloader';
import { useUrlSearchParams } from '@vueuse/core';
import PrintPage from '@/PrintPage.vue';
// import { i18n } from './i18n';

loadFonts().then();

if (useUrlSearchParams().printPage === 'auto') {
    createApp(PrintPage).use(vuetify).mount('#app');
} else {
    createApp(App).use(vuetify).mount('#app');
}
