import { createApp } from 'vue';
import App from './App.vue';
import './styles/index.scss';
import { key, store } from './stores';
import { i18n } from './i18n';

createApp(App).use(store, key).use(i18n).mount('#app');
