import axios from 'axios';
import crypto from 'crypto';
import { getCache, setCache } from '@/services/cache';
import axiosInterceptor from './axios-interceptor';
import globalNamespace from './global-namespace';
import polyfill from './polyfill';
import routerGuard from './router-guard';
import socketClientEvents from './socket-client-events';
import vuexObserver from './vuex-observer';

async function main(router, store) {
  const cache = getCache();
  
  if(!cache.cacheKey)  {
    cache.cacheKey = `${Date.now()}-${crypto.randomBytes(16).toString('hex')}`;
    setCache(cache);
  }

  if(cache.authenticationToken) store.commit('SET_STORAGE_AUTHENTICATION_TOKEN', cache.authenticationToken);

  globalNamespace();
  polyfill();

  axiosInterceptor(store);
  routerGuard(router, store);
  socketClientEvents(router, store);
  vuexObserver(store);

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
