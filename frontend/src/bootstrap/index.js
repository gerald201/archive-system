import axios from 'axios';
import { decrypt } from '@/services/cypher';
import { createSocketClient } from '@/services/socket';
import axiosInterceptor from './axios-interceptor';
import polyfill from './polyfill';
import routerGuard from './router-guard';
import vuexObserver from './vuex-observer';

async function main(router, store) {
  window.NAMESPACE_G = {socketClient: await createSocketClient()};

  axiosInterceptor(store);
  polyfill();
  routerGuard(router, store);
  vuexObserver(store);

  let cache;

  try {
    cache = JSON.parse(decrypt(localStorage.getItem('cache')));
  } catch(error) {
    cache = {};
  }

  if(cache.authenticationToken) store.commit('SET_STORAGE_AUTHENTICATION_TOKEN', cache.authenticationToken);

  store.commit('SET_APPLICATION_LOADING', true);

  addEventListener('load', async function() {
    try {
      axios.get('/ping/guest');
    } finally {
      store.commit('SET_APPLICATION_INITIALIZED', true);
      
      if(store.state.application.error) store.commit('SET_APPLICATION_LOADING', false);
      else {
        if(store.getters.authenticationAccessTokenAvailable) await store.dispatch('authenticationWhoami');
  
        store.commit('SET_APPLICATION_LOADING', false);
  
        const currentRoute = router.currentRoute.value;
  
        await router.push('/-');
        await router.push(currentRoute);
      }
    }
  });
}

export default main;
