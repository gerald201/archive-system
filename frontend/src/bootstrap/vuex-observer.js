import { getCache, setCache } from '@/services/cache';

function main(store) {
  store.watch(function(state) {
    return state.storage.authenticationToken;
  }, async function(value) {
    if(!store.state.application.initialized && value !== null) return;

    if(value === null) {
      store.commit('SET_STORAGE_AUTHENTICATION_USER', null);
      store.commit('SET_STORAGE_COURSE_COUNT', null);
      store.commit('SET_STORAGE_COURSES', null);
      store.commit('SET_STORAGE_LEVEL_COUNT', null);
      store.commit('SET_STORAGE_LEVELS', null);
      store.commit('SET_STORAGE_PROGRAM_COUNT', null);
      store.commit('SET_STORAGE_PROGRAMS', null);
      store.commit('SET_STORAGE_PROJECT_COUNT', null);
      store.commit('SET_STORAGE_PROJECTS', null);
      store.commit('SET_STORAGE_QUESTION_BANK_COUNT', null);
      store.commit('SET_STORAGE_QUESTION_BANKS', null);
      store.commit('SET_STORAGE_ROLE_COUNT', null);
      store.commit('SET_STORAGE_ROLES', null);
      store.commit('SET_STORAGE_SEMESTER_COUNT', null);
      store.commit('SET_STORAGE_SEMESTERS', null);
      store.commit('SET_STORAGE_USER_COUNT', null);
      store.commit('SET_STORAGE_USERS', null);
      store.commit('SET_STORAGE_USER_PROFILE_TYPE_COUNT', null);
      store.commit('SET_STORAGE_USER_PROFILE_TYPES', null);
    }

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.authenticationToken)) return;

    setCache({authenticationToken: value});
  }, {deep: true});

  store.watch(function(state) {
    return state.storage.courseCount;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.courseCount)) return;

    setCache({courseCount: value});
  });

  store.watch(function(state) {
    return state.storage.courses;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.courses)) return;

    setCache({courses: value});
  }, {deep: true});

  store.watch(function(state) {
    return state.storage.levelCount;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.levelCount)) return;

    setCache({levelCount: value});
  });

  store.watch(function(state) {
    return state.storage.levels;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.levels)) return;

    setCache({levels: value});
  }, {deep: true});

  store.watch(function(state) {
    return state.storage.programCount;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.programCount)) return;

    setCache({programCount: value});
  });

  store.watch(function(state) {
    return state.storage.programs;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.programs)) return;

    setCache({programs: value});
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
    return state.storage.semesterCount;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.semesterCount)) return;

    setCache({semesterCount: value});
  });

  store.watch(function(state) {
    return state.storage.semesters;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.semesters)) return;

    setCache({semesters: value});
  }, {deep: true});

  store.watch(function(state) {
    return state.storage.userCount;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.userCount)) return;

    setCache({userCount: value});
  });

  store.watch(function(state) {
    return state.storage.users;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.users)) return;

    setCache({users: value});
  }, {deep: true});

  store.watch(function(state) {
    return state.storage.userProfileTypeCount;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.userProfileTypeCount)) return;

    setCache({userProfileTypeCount: value});
  });

  store.watch(function(state) {
    return state.storage.userProfileTypes;
  }, function(value) {
    if(!store.state.application.initialized && value !== null) return;

    const cache = getCache();

    if(JSON.stringify(value) == JSON.stringify(cache.userProfileTypes)) return;

    setCache({userProfileTypes: value});
  }, {deep: true});
}

export default main;
