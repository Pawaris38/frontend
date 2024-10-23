import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import './index.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const app = createApp(App);
app.use(router);
app.use(Toast, {
    timeout: 2000,
  });
app.mount('#app');
