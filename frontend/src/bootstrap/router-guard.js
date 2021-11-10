import axios from 'axios';
import routerConfiguration from '@/configuration/router';

const guardKeys = [
  'requireAuth',
  'requireGuest',
  'requireStaffUserProfileType',
  'requireStudentUserProfileType'
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
    case 'requireStaffUserProfileType': return guards[guardName] ? store.getters.authenticated && store.state.storage.authenticationUser.UserProfile.UserProfileType.name == 'staff' : true;
    case 'requireStudentUserProfileType': return guards[guardName] ? store.getters.authenticated && store.state.storage.authenticationUser.UserProfile.UserProfileType.name == 'student' : true;
    default: return true;
  }
}

function main(router, store) {
  router.beforeEach(async function(to, from, next) {
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

    try {
      if(store.getters.authenticationAccessTokenAvailable) await axios.get('/ping/authentication');
      else await axios.get('/ping/guest');
    } catch(error) {}

    if(!store.state.application.initialized) return next();

    if(store.state.application.error) return next(false);

    if(!toGuardCheck) {
      if(!from.matched.length) return next(routerConfiguration.homeRoute);

      if(!fromGuardCheck) return next(routerConfiguration.homeRoute);

      return next(false);
    }

    return next();
  });
}

export default main;
