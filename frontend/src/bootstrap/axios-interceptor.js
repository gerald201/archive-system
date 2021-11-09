import axios from 'axios';
import apiConfiguration from '@/configuration/api';
import { emitter } from '@/services/emitter';

function main(store) {
  axios.defaults.baseURL = apiConfiguration.url;
  axios.defaults.headers.common['Api-Key'] = apiConfiguration.apiKey;

  axios.interceptors.request.use(function(request) {
    if(store.getters.authenticationAccessTokenAvailable) request.headers.Authorization = `Bearer ${store.state.storage.authenticationToken.access.token}`;

    return request;
  }, function(error) {
    throw error;
  });

  axios.interceptors.response.use(function(response) {
    emitter.emit('application:toast', {
      title: response.data.title,
      message: response.data.message
    });
    return response;
  }, async function(error) {
    const request = error.config;

    if(error.response?.data.payload.errorType == 'AuthorizationNotFoundError') {
      if(!request.$$refreshed && store.getters.authenticationRefreshTokenAvailable) {
        request.$$refreshed = true;
        await store.dispatch('authenticationRefresh');
        return await axios(request);
      }
      
      store.commit('SET_STORAGE_AUTHENTICATION_TOKEN', null);
      store.commit('SET_STORAGE_AUTHENTICATION_USER', null);
    }
    else if(!error.response || error.response.status >= 500) store.commit('SET_APPLICATION_ERROR', true);

    if(error.response) {
      emitter.emit('application:toast', {
        title: error.response.data.title,
        message: error.response.data.message
      });
    }

    throw error;
  });
}

export default main;