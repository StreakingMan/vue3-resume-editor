import { createApp } from 'vue';
import App from './App.vue';
import './styles/common.scss';
import { key, store } from './stores';

createApp(App).use(store, key).mount('#app');
