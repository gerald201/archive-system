import { createApp } from 'vue';
import App from '@/app';
import bootstrap from '@/bootstrap';
import router from '@/router';
import store from '@/store';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import '@/assets/styles/resets.scss';

const app = createApp(App);

bootstrap(router, store);

app.use(store);
app.use(router);
app.mount('#app');
