import routerConfiguration from '@/configuration/router';
import { getCache } from '@/services/cache';
import { checkRouterGuards } from '@/services/router';

function main(router, store) {
  $G.socketClient.on('app:cache', function(data) {
    const cache = getCache();
    const cacheKey = data?.cacheKey ?? '';
    const tokenKey = data?.tokenKey ?? '';

    if(cache.cacheKey != cacheKey) return;

    switch (tokenKey) {
      case 'authenticationToken': {
        store.commit('SET_STORAGE_AUTHENTICATION_TOKEN', cache[tokenKey]);

        if(store.getters.authenticationAccessTokenAvailable && !store.getters.authenticationUserAvailable) store.dispatch('authenticationWhoami');

        if(!checkRouterGuards(router.currentRoute.value)) router.push(routerConfiguration.homeRoute);
        break;
      }
      case 'courseCount':
        store.commit('SET_STORAGE_COURSE_COUNT', cache[tokenKey]);
        break;
      case 'courses':
        store.commit('SET_STORAGE_COURSES', cache[tokenKey]);
        break;
      case 'levelCount':
        store.commit('SET_STORAGE_LEVEL_COUNT', cache[tokenKey]);
        break;
      case 'levels':
        store.commit('SET_STORAGE_LEVELS', cache[tokenKey]);
        break;
      case 'programCount':
        store.commit('SET_STORAGE_PROGRAM_COUNT', cache[tokenKey]);
        break;
      case 'programs':
        store.commit('SET_STORAGE_PROGRAMS', cache[tokenKey]);
        break;
      case 'projectCount':
        store.commit('SET_STORAGE_PROJECT_COUNT', cache[tokenKey]);
        break;
      case 'projects':
        store.commit('SET_STORAGE_PROJECTS', cache[tokenKey]);
        break;
      case 'questionBankCount':
        store.commit('SET_STORAGE_QUESTION_BANK_COUNT', cache[tokenKey]);
        break;
      case 'questionBanks':
        store.commit('SET_STORAGE_QUESTION_BANKS', cache[tokenKey]);
        break;
      case 'roleCount':
        store.commit('SET_STORAGE_ROLE_COUNT', cache[tokenKey]);
        break;
      case 'roles':
        store.commit('SET_STORAGE_ROLES', cache[tokenKey]);
        break;
      case 'semesterCount':
        store.commit('SET_STORAGE_SEMESTER_COUNT', cache[tokenKey]);
        break;
      case 'semesters':
        store.commit('SET_STORAGE_SEMESTERS', cache[tokenKey]);
        break;
      case 'userCount':
        store.commit('SET_STORAGE_USER_COUNT', cache[tokenKey]);
        break;
      case 'users':
        store.commit('SET_STORAGE_USERS', cache[tokenKey]);
        break;
      case 'userProfileTypeCount':
        store.commit('SET_STORAGE_USER_PROFILE_TYPE_COUNT', cache[tokenKey]);
        break;
      case 'userProfileTypes':
        store.commit('SET_STORAGE_USER_PROFILE_TYPES', cache[tokenKey]);
        break;
    }
  });

  $G.socketClient.on('app:resource:update', function(data) {
    const resource = data?.resource ?? null;
    const type = data?.type ?? '';

    if(!resource) return;

    switch (type) {
      case 'courses':
        store.commit('REPLACE_STORAGE_COURSES', [resource]);
        break;
      case 'programs':
        store.commit('REPLACE_STORAGE_PROGRAMS', [resource]);
        break;
      case 'projects':
        store.commit('REPLACE_STORAGE_PROJECTS', [resource]);
        break;
      case 'question-banks':
        store.commit('REPLACE_STORAGE_QUESTION_BANKS', [resource]);
        break;
      case 'users':
        store.commit('REPLACE_STORAGE_USERS', [resource]);
        break;
    }

    store.dispatch('requestResourceCount', {type});
  });

  $G.socketClient.on('app:resource:create', function(data) {
    const resource = data?.resource ?? null;
    const type = data?.type ?? '';

    if(!resource) return;

    switch (type) {
      case 'courses': {
        if(store.state.storage.courseCount - (store.state.storage.courses || []).length <= 5) {
          store.commit('ADD_STORAGE_COURSES', [resource]);
          store.dispatch('requestResource', {type});
        }

        break;
      }
      case 'programs': {
        if(store.state.storage.programCount - (store.state.storage.programs || []).length <= 5) {
          store.commit('ADD_STORAGE_PROGRAMS', [resource]);
          store.dispatch('requestResource', {type});
        }

        break;
      }
      case 'projects': {
        if(store.state.storage.projectCount - (store.state.storage.projects || []).length <= 5) {
          store.commit('ADD_STORAGE_PROJECTS', [resource]);
          store.dispatch('requestResource', {type});
        }

        break;
      }
      case 'question-banks': {
        if(store.state.storage.questionBankCount - (store.state.storage.questionBanks || []).length <= 5) {
          store.commit('ADD_STORAGE_QUESTION_BANKS', [resource]);
          store.dispatch('requestResource', {type});
        }

        break;
      }
      case 'users': {
        if(store.state.storage.userCount - (store.state.storage.users || []).length <= 5) {
          store.commit('ADD_STORAGE_USERS', [resource]);
          store.dispatch('requestResource', {type});
        }

        break;
      }
    }
  });
}

export default main;
