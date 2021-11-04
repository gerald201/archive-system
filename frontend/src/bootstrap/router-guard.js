import routerConfiguration from '@/configuration/router';

const guardKeys = [
  'requireAuth',
  'requireGuest'
];

function checkGuard(route, guardName, store) {
  const guards = guardKeys
    .reduce(function(result, guardKey) {
      result[guardKey] = route.matched
        .some(function(m) {
          return m.meta.guards?.[guardKey] === true
        });
      return result;
    }, {});
  
  switch(guardName) {
    case 'requireAuth': return guards[guardName] ? store.getters.authenticated : true;
    case 'requireGuest': return guards[guardName] ? !store.getters.authenticated : true;
    default: return true;
  }
}

function main(router, store) {
  router.beforeEach(function(to, from, next) {
    const fromGuardCheck = guardKeys
      .every(function(guardKey) {
        return checkGuard(from, guardKey, store);
      });
    const toGuardCheck = guardKeys
      .every(function(guardKey) {
        return checkGuard(to, guardKey, store);
      });

    if(!to.matched.length) {
      if(!from.matched.length) return next(routerConfiguration.homeRoute);

      if(!fromGuardCheck) return next(routerConfiguration.homeRoute);

      return next(false);
    }

    if(!store.state.application.initialized) return next();

    if(!toGuardCheck) {
      if(!from.matched.length) return next(routerConfiguration.homeRoute);

      if(!fromGuardCheck) return next(routerConfiguration.homeRoute);

      return next(false);
    }

    return next();
  });
}

export default main;
