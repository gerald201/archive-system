import axios from 'axios';
import { createStore } from 'vuex';

export default createStore({
  state: {
    application: {
      error: false,
      initialized: false,
      loading: false,
      mainAsideHidden: false,
      mainAsideOpened: false,
      mainHeaderHidden: false
    },
    cache: {},
    settings: {},
    storage: {
      authenticationToken: null,
      authenticationUser: null,
      projects: [],
      questionBanks: [],
      students: [],
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
    SET_APPLICATION_MAIN_ASIDE_OPENED(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.mainAsideOpened = payload;
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
    },
    SET_STORAGE_PROJECTS(state, payload) {
      if(!Array.isArray(payload)) return;

      state.storage.projects = payload;
    },
    SET_STORAGE_QUESTION_BANKS(state, payload) {
      if(!Array.isArray(payload)) return;

      state.storage.questionBanks = payload;
    },
    SET_STORAGE_STUDENTS(state, payload) {
      if(!Array.isArray(payload)) return;

      state.storage.students = payload;
    },
  },
  actions: {
    async authenticationRefresh(context) {
      try {
        const response = await axios.get('/api/authentication/refresh', {
          params: {token: context.state.storage.authenticationToken?.refresh.token || ''}
        });

        context.commit('SET_STORAGE_AUTHENTICATION_TOKEN', {
          access: response.data.payload.token.access,
          refresh: context.state.storage.authenticationToken?.refresh || null
        });
      } catch(error) {
        return false;
      }
    },
    async authenticationSignIn(context, payload) {
      try {
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
    },
    async getProjectsFromApi(context) {
      try {
        const response = await axios.get('/api/projects');

        context.commit('SET_STORAGE_PROJECTS', response.data.payload.projects);
        return true;
      } catch(error) {
        return false;
      }
    },
    async getQuestionBanksFromApi(context) {
      try {
        const response = await axios.get('/api/question-banks');

        context.commit('SET_STORAGE_QUESTION_BANKS', response.data.payload.questionBanks);
        return true;
      } catch(error) {
        return false;
      }
    },
    async getStudentsFromApi(context) {
      try {
        const response = await axios.get('/api/students');

        context.commit('SET_STORAGE_STUDENTS', response.data.payload.students);
        return true;
      } catch(error) {
        return false;
      }
    },
  },
  modules: {},
  strict: true
});
