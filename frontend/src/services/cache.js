import { decrypt, encrypt } from './cypher';

export function getCache() {
  let cache;

  try {
    cache = JSON.parse(decrypt(localStorage.getItem('cache')));
  } catch(error) {
    cache = {};
  }

  return cache;
}

export function setCache(data) {
  let preppedData;

  try {
    preppedData = JSON.parse(JSON.stringify(data));

    if(preppedData?.constructor?.name?.toLowerCase() != 'object') return;
  } catch(error) {
    return;
  }

  const oldCache = getCache();
  const cache = Object.assign({}, oldCache, preppedData);

  localStorage.setItem('cache', encrypt(JSON.stringify(cache)));

  for(const key in preppedData) {
    if(JSON.stringify(oldCache[key]) == JSON.stringify(cache[key])) continue;

    setTimeout(function() {
      $G.socketClient.emit('app:cache', {
        cacheKey: cache.cacheKey,
        tokenKey: key
      });
    });
  }
}

window.getCache = getCache;

export default {
  getCache,
  setCache
};
