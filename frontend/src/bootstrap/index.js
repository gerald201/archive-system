import axios from 'axios';
import axiosInterceptor from './axios-interceptor';
import polyfill from './polyfill';
import routerGuard from './router-guard';

async function main(router, store) {
  axiosInterceptor(store);
  polyfill();
  routerGuard(router, store);

  store.commit('SET_APPLICATION_LOADING', true);

  try {
    axios.get('/ping');
  } catch(error) {
    console.log('Oh no');
  } finally {
    if(store.state.application.error) {
      store.commit('SET_APPLICATION_LOADING', false);
      store.commit('SET_APPLICATION_INITIALIZED', true);
    } else {
      await store.dispatch('authenticationWhoami');
      store.commit('SET_APPLICATION_LOADING', false);
      store.commit('SET_APPLICATION_INITIALIZED', true);

      const currentRoute = router.currentRoute.value;

      await router.push('/-');
      await router.push(currentRoute);
    }
  }
}

export default main;
