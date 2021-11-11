import routerConfiguration from '@/configuration/router';
import { getCache } from '@/services/cache';
import { checkRouterGuards } from '@/services/router';

function main(router, store) {
  $G.socketClient.on('re:api:projects:counted', function(projectCount) {
    store.commit('SET_STORAGE_PROJECT_COUNT', projectCount);
  });

  $G.socketClient.on('re:api:question-banks:counted', function(questionBankCount) {
    store.commit('SET_STORAGE_QUESTION_BANK_COUNT', questionBankCount);
  });

  $G.socketClient.on('re:api:students:counted', function(studentCount) {
    store.commit('SET_STORAGE_STUDENT_COUNT', studentCount);
  });

  $G.socketClient.on('re:api:students:created', function(student) {
    const check = (store.state.storage.students || [])
      .some(function(existngStudent) {
        return existngStudent.id == student.id;
      });

    if(!check) store.commit('SET_STORAGE_STUDENTS', (store.state.storage.students || []).concat([student]));
  });

  $G.socketClient.on('re:api:students:destroyed', function(student) {
    if(store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student') {
      store.commit('SET_STORAGE_STUDENTS', (store.state.storage.students || [])
        .filter(function(existingStudent) {
          return existingStudent.id != student.id;
        }));
    } else if(store.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'staff') {
      const check = (store.state.storage.students || [])
        .some(function(existngStudent) {
          return existngStudent.id == student.id;
        });

      if(check) {
        store.commit('SET_STORAGE_STUDENTS', (store.state.storage.students || [])
          .map(function(existngStudent) {
            if(existngStudent.id == student.id) return student;

            return existngStudent;
          }));
      }
      else store.commit('SET_STORAGE_STUDENTS', (store.state.storage.students || []).concat([student]));
    }
  });

  $G.socketClient.on('re:api:students:obliterated', function(student) {
    store.commit('SET_STORAGE_STUDENTS', (store.state.storage.students || [])
      .filter(function(existngStudent) {
        return existngStudent.id != student.id;
      }));
  });

  $G.socketClient.on('re:api:students:restored', function(student) {
    const check = (store.state.storage.students || [])
        .some(function(existngStudent) {
          return existngStudent.id == student.id;
        });

    if(check) {
      store.commit('SET_STORAGE_STUDENTS', (store.state.storage.students || [])
        .map(function(existngStudent) {
          if(existngStudent.id == student.id) return student;

          return existngStudent;
        }));
    }
    else store.commit('SET_STORAGE_STUDENTS', (store.state.storage.students || []).concat([student]));
  });

  $G.socketClient.on('re:api:students:updated', function(student) {
    const check = (store.state.storage.students || [])
      .some(function(existngStudent) {
        return existngStudent.id == student.id;
      });

    if(check) {
      store.commit('SET_STORAGE_STUDENTS', (store.state.storage.students || [])
        .map(function(existngStudent) {
          if(existngStudent.id == student.id) return student;

          return existngStudent;
        }));
    }
    else store.commit('SET_STORAGE_STUDENTS', (store.state.storage.students || []).concat([student]));
  });

  $G.socketClient.on('re:app:cache', function(data) {
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
      case 'studentCount':
        store.commit('SET_STORAGE_STUDENT_COUNT', cache[tokenKey]);
        break;
      case 'students':
        store.commit('SET_STORAGE_STUDENTS', cache[tokenKey]);
        break;
    }
  })
}

export default main;
