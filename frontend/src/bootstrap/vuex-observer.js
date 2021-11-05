import { decrypt, encrypt } from '@/services/cypher';

function main(store) {
  store.watch(function(state) {
    return state.storage.authenticationToken;
  }, function(value) {
    if(!store.state.application.initialized && value) return;

    let cache;

    try {
      cache = JSON.parse(decrypt(localStorage.getItem('cache')));
    } catch(error) {
      cache = {};
    }

    cache.authenticationToken = value;
    localStorage.setItem('cache', encrypt(JSON.stringify(cache)));
  }, {deep: true});

  store.watch(function(state, getters) {
    return getters.authenticated;
  }, async function(value) {
    if(value) {
      await store.dispatch('getProjectsFromApi');
      await store.dispatch('getQuestionBanksFromApi');
      await store.dispatch('getStudentsFromApi');
    } else {
      store.commit('SET_STORAGE_PROJECTS', []);
      store.commit('SET_STORAGE_QUESTION_BANKS', []);
      store.commit('SET_STORAGE_STUDENTS', []);
    }
  });
}

export default main;
