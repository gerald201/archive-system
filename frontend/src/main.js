import { createApp } from 'vue';
import App from '@/app';
import router from '@/router';
import store from '@/store';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const app = createApp(App);

app.use(store);
app.use(router);
app.mount('#app');
