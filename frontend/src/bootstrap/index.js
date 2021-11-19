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

  globalNamespace();
  polyfill();
  axiosInterceptor(store);
  routerGuard(router, store);
  socketClientEvents(router, store);
  vuexObserver(store);

  if(cache.authenticationToken) store.commit('SET_STORAGE_AUTHENTICATION_TOKEN', cache.authenticationToken);

  store.commit('SET_APPLICATION_LOADING', true);

  addEventListener('load', async function() {
    try {
      await axios.get('/ping/guest');
    } finally {
      store.commit('SET_APPLICATION_INITIALIZED', true);
      
      if(store.state.application.error) store.commit('SET_APPLICATION_LOADING', false);
      else {
        if(store.getters.authenticationAccessTokenAvailable) {
          await store.dispatch('authenticationWhoami');

          for(const key in cache) {
            if(!store.getters.authenticated) break;
            
            if(!cache[key] === null) continue;
        
            switch (key) {
              case 'courseCount':
                store.commit('SET_STORAGE_COURSE_COUNT', cache[key]);
                store.dispatch('refreshResource', {type: 'courses'});
                break;
              case 'courses':
                store.commit('SET_STORAGE_COURSES', cache[key]);
                break;
              case 'levelCount':
                store.commit('SET_STORAGE_LEVEL_COUNT', cache[key]);
                break;
              case 'levels':
                store.commit('SET_STORAGE_LEVELS', cache[key]);
                break;
              case 'programCount':
                store.commit('SET_STORAGE_PROGRAM_COUNT', cache[key]);
                break;
              case 'programs':
                store.commit('SET_STORAGE_PROGRAMS', cache[key]);
                store.dispatch('refreshResource', {type: 'programs'});
                break;
              case 'projectCount':
                store.commit('SET_STORAGE_PROJECT_COUNT', cache[key]);
                break;
              case 'projects':
                store.commit('SET_STORAGE_PROJECTS', cache[key]);
                store.dispatch('refreshResource', {type: 'projects'});
                break;
              case 'questionBankCount':
                store.commit('SET_STORAGE_QUESTION_BANK_COUNT', cache[key]);
                break;
              case 'questionBanks':
                store.commit('SET_STORAGE_QUESTION_BANKS', cache[key]);
                store.dispatch('refreshResource', {type: 'question-banks'});
                break;
              case 'semesterCount':
                store.commit('SET_STORAGE_SEMESTER_COUNT', cache[key]);
                break;
              case 'semesters':
                store.commit('SET_STORAGE_SEMESTERS', cache[key]);
                break;
              case 'userCount':
                store.commit('SET_STORAGE_USER_COUNT', cache[key]);
                break;
              case 'users':
                store.commit('SET_STORAGE_USERS', cache[key]);
                store.dispatch('refreshResource', {type: 'users'});
                break;
              case 'userProfileTypeCount':
                store.commit('SET_STORAGE_USER_PROFILE_TYPE_COUNT', cache[key]);
                break;
              case 'userProfileTypes':
                store.commit('SET_STORAGE_USER_PROFILE_TYPES', cache[key]);
                break;
            }
          }
        }
  
        store.commit('SET_APPLICATION_LOADING', false);
  
        const currentRoute = router.currentRoute.value;
  
        await router.push('/-');
        await router.push(currentRoute);
      }
    }
  });
}

export default main;
