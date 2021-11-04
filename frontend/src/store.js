import axios from 'axios';
import { createStore } from 'vuex';
import { validate } from '@/services/fastest-validator';

export default createStore({
  state: {
    application: {
      error: false,
      initialized: false,
      loading: false,
      mainAsideHidden: false,
      mainHeaderHidden: false
    },
    cache: {},
    settings: {},
    storage: {
      authenticationToken: null,
      authenticationUser: null,
    },
  },
  getters: {
    authenticated(state, getters) {
      return getters.authenticationAccessTokenAvailable && getters.authenticationUserAvailable;
    },
    authenticationAccessTokenAvailable(state) {
      return !!state.storage.authenticationToken?.access?.token;
    },
    authenticationRefreshTokenAvailable(state) {
      return !!state.storage.authenticationToken?.reresh?.token;
    },
    authenticationUserAvailable(state) {
      return !!state.storage.authenticationUser;
    }
  },
  mutations: {
    SET_APPLICATION_ERROR(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.error = payload;
    },
    SET_APPLICATION_INITIALIZED(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.initialized = payload;
    },
    SET_APPLICATION_LOADING(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.loading = payload;
    },
    SET_APPLICATION_MAIN_ASIDE_HIDDEN(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.mainAsideHidden = payload;
    },
    SET_APPLICATION_MAIN_HEADER_HIDDEN(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.mainHeaderHidden = payload;
    },
    SET_STORAGE_AUTHENTICATION_TOKEN(state, payload) {
      if(payload && payload?.constructor?.name?.toLowerCase() != 'object') return;

      state.storage.authenticationToken = payload || null;
    },
    SET_STORAGE_AUTHENTICATION_USER(state, payload) {
      if(payload && payload?.constructor?.name?.toLowerCase() != 'object') return;

      state.storage.authenticationUser = payload || null;
    }
  },
  actions: {
    async authenticationRefresh(context) {
      try {
        if(!context.getters.authenticationRefreshTokenAvailable) return false;

        const response = await axios.get('/api/authentication/refresh', {
          params: {token: context.state.storage.authenticationToken.refresh.token}
        });

        context.commit('SET_STORAGE_AUTHENTICATION_TOKEN', {
          access: response.data.payload.token.access,
          refresh: context.state.storage.authenticationToken?.refresh
        });
      } catch(error) {
        return false;
      }
    },
    async authenticationSignIn(context, payload) {
      try {
        const schema = {
          $$strict: 'remove',
          index: {
            type: 'string',
            empty: false
          },
          password: {
            type: 'string',
            empty: false
          }
        };
        const validated = validate(payload, schema);

        if(validated !== true) return false;

        const response = await axios.post('/api/authentication/sign-in', payload);

        context.commit('SET_STORAGE_AUTHENTICATION_TOKEN', response.data.payload.token);
        context.commit('SET_STORAGE_AUTHENTICATION_USER', response.data.payload.user);
        return true;
      } catch(error) {
        return false;
      }
    },
    async authenticationSignOut(context) {
      try {
        await axios.get('/api/authentication/sign-out');
        context.commit('SET_STORAGE_AUTHENTICATION_TOKEN', null);
        context.commit('SET_STORAGE_AUTHENTICATION_USER', null);
        return true;
      } catch(error) {
        return false;
      }
    },
    async authenticationWhoami(context) {
      try {
        const response = await axios.get('/api/authentication/whoami');

        context.commit('SET_STORAGE_AUTHENTICATION_USER', response.data.payload.user);
        return true;
      } catch(error) {
        return false;
      }
    }
  },
  modules: {},
  strict: true
});
