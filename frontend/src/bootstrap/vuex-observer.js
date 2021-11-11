import { getCache, setCache } from '@/services/cache';

function main(store) {
  store.watch(function(state) {
    return state.storage.authenticationToken;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    if(value === null) {
      store.commit('SET_STORAGE_AUTHENTICATION_USER', null);
      store.commit('SET_STORAGE_PROJECT_COUNT', null);
      store.commit('SET_STORAGE_PROJECTS', null);
      store.commit('SET_STORAGE_QUESTION_BANK_COUNT', null);
      store.commit('SET_STORAGE_QUESTION_BANKS', null);
      store.commit('SET_STORAGE_STUDENT_COUNT', null);
      store.commit('SET_STORAGE_STUDENTS', null);
    }

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.authenticationToken)) return;

    setCache({authenticationToken: value});
  }, {deep: true});

  store.watch(function(state) {
    return state.storage.projectCount;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.projectCount)) return;

    setCache({projectCount: value});
  });

  store.watch(function(state) {
    return state.storage.projects;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.projects)) return;

    setCache({projects: value});
  }, {deep: true});

  store.watch(function(state) {
    return state.storage.questionBankCount;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.questionBankCount)) return;

    setCache({questionBankCount: value});
  });

  store.watch(function(state) {
    return state.storage.questionBanks;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.questionBanks)) return;

    setCache({questionBanks: value});
  }, {deep: true});

  store.watch(function(state) {
    return state.storage.studentCount;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.studentCount)) return;

    setCache({studentCount: value});
  });

  store.watch(function(state) {
    return state.storage.students;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.students)) return;

    setCache({students: value});
  }, {deep: true});
}

export default main;
