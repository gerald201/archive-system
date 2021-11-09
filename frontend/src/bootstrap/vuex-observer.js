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
}

export default main;
