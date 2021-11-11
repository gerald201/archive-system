import axios from 'axios';
import routerConfiguration from '@/configuration/router';
import { checkRouterGuards } from '@/services/router';

function main(router, store) {
  router.beforeEach(async function(to, from, next) {
    try {
      if((fromGuardCheck.requireAuthentication || fromGuardCheck.requireStaffUserProfileType || fromGuardCheck.requireStudentUserProfileType || toGuardCheck.requireAuthentication || toGuardCheck.requireStaffUserProfileType || toGuardCheck.requireStudentUserProfileType) && store.getters.authenticationAccessTokenAvailable) await axios.get('/ping/authentication');
    } catch(error) {}

    const fromGuardCheck = checkRouterGuards(from);
    const toGuardCheck = checkRouterGuards(to);

    if(!to.matched.length) {
      if(!from.matched.length) return next(routerConfiguration.homeRoute);

      if(!fromGuardCheck) return next(routerConfiguration.homeRoute);

      return next(false);
    }

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
