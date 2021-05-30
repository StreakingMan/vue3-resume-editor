import { createApp } from 'vue';
import App from './App.vue';
import './styles/index.scss';
import '@mdi/font/css/materialdesignicons.css';
import 'animate.css/animate.min.css';
import { i18n } from './i18n';

createApp(App).use(i18n).mount('#app');
