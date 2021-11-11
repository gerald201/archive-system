import axios from 'axios';
import { createStore } from 'vuex';
import { emitter } from '@/services/emitter';

export default createStore({
  state: {
    application: {
      error: false,
      initialized: false,
      loading: false,
      mainAsideHidden: false,
      mainAsideOpened: false,
      mainHeaderHidden: false
    },
    cache: {},
    settings: {},
    storage: {
      authenticationToken: null,
      authenticationUser: null,
      projectCount:null,
      projects: null,
      questionBankCount:null,
      questionBanks: null,
      resourcePageSize: 20,
      roles: null,
      studentCount:null,
      students: null,
    },
  },
  getters: {
    authenticated(state, getters) {
      return getters.authenticationAccessTokenAvailable && getters.authenticationUserAvailable;
    },
    authenticationAccessTokenAvailable(state) {
      return !!state.storage.authenticationToken?.access?.token;
    },
    authenticationRefreshTokenAvailable(state) {
      return !!state.storage.authenticationToken?.refresh?.token;
    },
    authenticationUserAvailable(state) {
      return !!state.storage.authenticationUser;
    },
    authenticationUserHasRoles(state) {
      return function(roles) {
        const include = (Array.isArray(roles?.include) ? roles.include : (typeof roles?.include == 'string' ? [roles.include] : (Array.isArray(roles) ? roles : (typeof roles == 'string' ? [roles] : []))))
          .filter(function(includedRole) {
            return state.storage.roles
              .some(function(role) {
                return role.name == includedRole;
              });
          });
        const exclude = (Array.isArray(roles?.exclude) ? roles.exclude : (typeof roles?.exclude == 'string' ? [roles.exclude] : []))
          .filter(function(excludedRole) {
            const roleExsits = state.storage.roles
              .some(function(role) {
                return role.name == excludedRole;
              });

            return roleExsits && !include.includes(excludedRole);
          });
        const includeCount = include
          .reduce(function(accumulator, current) {
            if(!state.storage.authenticationUser) return 0;

            const check = state.storage.authenticationUser.Roles
              .some(function(role) {
                return role.name == current;
              });

            return check ? accumulator + 1 : accumulator;
          }, 0);
        const excludeCount = exclude
          .reduce(function(accumulator, current) {
            if(!state.storage.authenticationUser) return 0;

            const check = state.storage.authenticationUser.Roles
              .some(function(role) {
                return role.name == current;
              });

            return check ? accumulator + 1 : accumulator;
          }, 0);
        const includeCheck = include.length ? includeCount > 0 : true;
        const excludeCheck = exclude.length ? excludeCount == 0 : true;

        return includeCheck || excludeCheck;
      }
    }
  },
  mutations: {
    SET_APPLICATION_ERROR(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.error = payload;
    },
    SET_APPLICATION_INITIALIZED(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.initialized = payload;
    },
    SET_APPLICATION_LOADING(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.loading = payload;
    },
    SET_APPLICATION_MAIN_ASIDE_HIDDEN(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.mainAsideHidden = payload;
      
      if(!payload) state.application.mainAsideOpened = false;
    },
    SET_APPLICATION_MAIN_ASIDE_OPENED(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.mainAsideOpened = payload;
    },
    SET_APPLICATION_MAIN_HEADER_HIDDEN(state, payload) {
      if(typeof payload != 'boolean') return;

      state.application.mainHeaderHidden = payload;
    },
    SET_STORAGE_AUTHENTICATION_TOKEN(state, payload) {
      if(payload && payload?.constructor?.name?.toLowerCase() != 'object') return;

      state.storage.authenticationToken = payload || null;
    },
    SET_STORAGE_AUTHENTICATION_USER(state, payload) {
      if(payload && payload?.constructor?.name?.toLowerCase() != 'object') return;

      state.storage.authenticationUser = payload || null;
    },
    SET_STORAGE_PROJECT_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.projectCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_PROJECTS(state, payload) {
      if(!(payload === null || Array.isArray(payload))) return;

      state.storage.projects = payload;
    },
    SET_STORAGE_QUESTION_BANK_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.questionBankCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_QUESTION_BANKS(state, payload) {
      if(!(payload === null || Array.isArray(payload))) return;

      state.storage.questionBanks = payload;
    },
    SET_STORAGE_ROLES(state, payload) {
      if(!(payload === null || Array.isArray(payload))) return;

      state.storage.roles = payload;
    },
    SET_STORAGE_STUDENT_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.studentCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_STUDENTS(state, payload) {
      if(!(payload === null || Array.isArray(payload))) return;

      state.storage.students = payload;
    }
  },
  actions: {
    async authenticationRefresh(context) {
      try {
        if(!context.getters.authenticationRefreshTokenAvailable) return false;

        const response = await axios.get('/api/authentication/refresh', {
          params: {token: context.state.storage.authenticationToken?.refresh.token || ''}
        });

        context.commit('SET_STORAGE_AUTHENTICATION_TOKEN', {
          access: response.data.payload.token.access,
          refresh: context.state.storage.authenticationToken.refresh
        });
        emitter.emit('application:toast', {
          title: response.data.title,
          message: response.data.message
        });
        return true;
      } catch(error) {
        return false;
      }
    },
    async authenticationSignIn(context, payload) {
      try {
        const response = await axios.post('/api/authentication/sign-in', payload);

        context.commit('SET_STORAGE_AUTHENTICATION_TOKEN', response.data.payload.token);
        context.commit('SET_STORAGE_AUTHENTICATION_USER', response.data.payload.user);
        emitter.emit('application:toast', {
          title: response.data.title,
          message: response.data.message
        });
        await context.dispatch('requestRoles');
        return true;
      } catch(error) {
        return false;
      }
    },
    async authenticationSignOut(context) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const response = await axios.get('/api/authentication/sign-out');
        context.commit('SET_STORAGE_AUTHENTICATION_TOKEN', null);
        emitter.emit('application:toast', {
          title: response.data.title,
          message: response.data.message
        });
        return true;
      } catch(error) {
        return false;
      }
    },
    async authenticationWhoami(context) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const response = await axios.get('/api/authentication/whoami');

        context.commit('SET_STORAGE_AUTHENTICATION_USER', response.data.payload.user);
        await context.dispatch('requestRoles');
        return true;
      } catch(error) {
        return false;
      }
    },
    async createStudent(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        if(!context.getters.authenticationUserHasRoles('super_administrator')) return false;

        const response = await axios.post('/api/students/create', payload);

        context.dispatch('requestStudentCount');
        context.commit('SET_STORAGE_STUDENTS', (context.state.storage.students || []).concat([response.data.payload.student]));
        $G.socketClient.emit('api:students:created', response.data.payload.student);
        emitter.emit('application:toast', {
          title: response.data.title,
          message: response.data.message
        });
        return true;
      } catch(error) {
        return false;
      }
    },
    async destroyStudent(context, payload) {
      try {
        const id = isNaN(parseInt(payload)) ? null : parseInt(payload);

        if(id === null) return false;

        if(!context.getters.authenticationAccessTokenAvailable) return false;

        if(!context.getters.authenticationUserHasRoles('super_administrator')) return false;

        const response = await axios.delete(`/api/students/destroy/${id}`);
        const check = (context.state.storage.students || [])
          .some(function(existingStudent) {
            return existingStudent.id == response.data.payload.student.id
          });

        if(check) {
          context.commit('SET_STORAGE_STUDENTS', (context.state.storage.students || [])
            .map(function(existingStudent) {
              if(existingStudent.id == response.data.payload.student.id) return response.data.payload.student;

              return existingStudent;
            }));
        }
        else context.commit('SET_STORAGE_STUDENTS', (context.state.storage.students || []).concat([response.data.payload.student]));
        
        $G.socketClient.emit('api:students:destroyed', response.data.payload.student);
        emitter.emit('application:toast', {
          title: response.data.title,
          message: response.data.message
        });
        return true;
      } catch(error) {
        return false;
      }
    },
    async obliterateStudent(context, payload) {
      try {
        const id = isNaN(parseInt(payload)) ? null : parseInt(payload);

        if(id === null) return false;

        if(!context.getters.authenticationAccessTokenAvailable) return false;

        if(!context.getters.authenticationUserHasRoles('super_administrator')) return false;

        const response = await axios.delete(`/api/students/obliterate/${id}`);

        context.dispatch('requestStudentCount');
        context.commit('SET_STORAGE_STUDENTS', (context.state.storage.students || [])
          .filter(function(existingStudent) {
            return existingStudent.id != response.data.payload.student.id;
          }));
        $G.socketClient.emit('api:students:obliterated', response.data.payload.student);
        emitter.emit('application:toast', {
          title: response.data.title,
          message: response.data.message
        });
        return true;
      } catch(error) {
        return false;
      }
    },
    async requestProjectCount(context) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const response = await axios.get('/api/projects/count');

        context.commit('SET_STORAGE_PROJECT_COUNT', response.data.payload.projectCount);
        $G.socketClient.emit('api:projects:counted', response.data.payload.projectCount);
        return true;
      } catch(error) {
        return false;
      }
    },
    async requestProjects(context) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        if(context.state.storage.projectCount !== null && context.state.storage.projects !== null && context.state.storage.projectCount == (context.state.storage.projects?.length || 0)) return true;

        if(context.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name != 'super_administrator') {
          const response = await axios.get('/api/projects', {
            params: {
              pagination: {
                page: 1,
                size: 20
              },
              where: {
                id: {
                  $notIn: (context.state.storage.projects || [])
                    .map(function(project) {
                      return project.id
                    })
                },
                deletedAt: null
              }
            }
          });

          context.commit('SET_STORAGE_PROJECTS', (context.state.storage.projects || []).concat(response.data.payload.projects));
          return true;
        }

        context.dispatch('requestProjectCount');
        
        const response = await axios.get('/api/projects', {
          params: {
            pagination: {
              page: 1,
              size: 20
            },
            where: {
              id: {
                $notIn: (context.state.storage.projects || [])
                  .map(function(project) {
                    return project.id
                  })
              }
            }
          }
        });

        context.commit('SET_STORAGE_PROJECTS', (context.state.storage.projects || []).concat(response.data.payload.projects));
        return true;
      } catch(error) {
        return false;
      }
    },
    async requestQuestionBankCount(context) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const response = await axios.get('/api/question-banks/count');

        context.commit('SET_STORAGE_QUESTION_BANK_COUNT', response.data.payload.questionBankCount);
        $G.socketClient.emit('api:question-banks:counted', response.data.payload.questionBankCount);
        return true;
      } catch(error) {
        return false;
      }
    },
    async requestQuestionBanks(context) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        if(context.state.storage.questionBankCount !== null && context.state.storage.questionBanks !== null && context.state.storage.questionBankCount == (context.state.storage.questionBanks?.length || 0)) return true;

        if(context.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name != 'super_administrator') {
          const response = await axios.get('/api/question-banks', {
            params: {
              pagination: {
                page: 1,
                size: 20
              },
              where: {
                id: {
                  $notIn: (context.state.storage.questionBanks || [])
                    .map(function(questionBank) {
                      return questionBank.id
                    })
                },
                deletedAt: null
              }
            }
          });

          context.commit('SET_STORAGE_QUESTION_BANKS', (context.state.storage.questionBanks || []).concat(response.data.payload.questionBanks));
          return true;
        }

        context.dispatch('requestQuestionBankCount');

        const response = await axios.get('/api/question-banks', {
          params: {
            pagination: {
              page: 1,
              size: 20
            },
            where: {
              id: {
                $notIn: (context.state.storage.questionBanks || [])
                  .map(function(questionBank) {
                    return questionBank.id
                  })
              }
            }
          }
        });

        context.commit('SET_STORAGE_QUESTION_BANKS', (context.state.storage.questionBanks || []).concat(response.data.payload.questionBanks));
        return true;
      } catch(error) {
        return false;
      }
    },
    async requestRoles(context) {
      try {
        const response = await axios.get('/api/roles');

        context.commit('SET_STORAGE_ROLES', response.data.payload.roles);
        return true;
      } catch(error) {
        return false;
      }
    },
    async requestStudentCount(context) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const response = await axios.get('/api/students/count');

        context.commit('SET_STORAGE_STUDENT_COUNT', response.data.payload.studentCount);
        $G.socketClient.emit('api:students:counted', response.data.payload.studentCount);
        return true;
      } catch(error) {
        return false;
      }
    },
    async requestStudents(context) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        if(!context.getters.authenticationUserHasRoles('super_administrator')) return false;

        if(context.state.storage.studentCount !== null && context.state.storage.students !== null && context.state.storage.studentCount == context.state.storage.students.length) return true;

        context.dispatch('requestStudentCount');

        const response = await axios.get('/api/students', {
          params: {
            pagination: {
              page: 1,
              size: 20
            },
            where: {
              id: {
                $notIn: (context.state.storage.students || [])
                  .map(function(student) {
                    return student.id
                  })
              }
            }
          }
        });

        context.commit('SET_STORAGE_STUDENTS', (context.state.storage.students || []).concat(response.data.payload.students));
        return true;
      } catch(error) {
        return false;
      }
    },
    async restoreStudent(context, payload) {
      try {
        const id = isNaN(parseInt(payload)) ? null : parseInt(payload);

        if(id === null) return false;

        if(!context.getters.authenticationAccessTokenAvailable) return false;

        if(!context.getters.authenticationUserHasRoles('super_administrator')) return false;

        const response = await axios.post(`/api/students/restore/${id}`);
        const check = (context.state.storage.students || [])
          .some(function(existingStudent) {
            return existingStudent.id == response.data.payload.student.id
          });

        if(check) {
          context.commit('SET_STORAGE_STUDENTS', (context.state.storage.students || [])
            .map(function(existingStudent) {
              if(existingStudent.id == response.data.payload.student.id) return response.data.payload.student;

              return existingStudent;
            }));
        }
        else context.commit('SET_STORAGE_STUDENTS', (context.state.storage.students || []).concat([response.data.payload.student]));
        
        $G.socketClient.emit('api:students:restored', response.data.payload.student);
        emitter.emit('application:toast', {
          title: response.data.title,
          message: response.data.message
        });
        return true;
      } catch(error) {
        return false;
      }
    },
    async updateStudent(context, payload) {
      try {
        const id = isNaN(parseInt(payload?.id)) ? null : parseInt(payload.id);
        const data = payload?.data || null;

        if(id === null || data === null) return false;

        if(!context.getters.authenticationAccessTokenAvailable) return false;

        if(!context.getters.authenticationUserHasRoles('super_administrator')) return false;

        const response = await axios.patch(`/api/students/update/${id}`, data);
        const check = (context.state.storage.students || [])
          .some(function(existingStudent) {
            return existingStudent.id == response.data.payload.student.id
          });

        if(check) {
          context.commit('SET_STORAGE_STUDENTS', (context.state.storage.students || [])
            .map(function(existingStudent) {
              if(existingStudent.id == response.data.payload.student.id) return response.data.payload.student;

              return existingStudent;
            }));
        }
        else context.commit('SET_STORAGE_STUDENTS', (context.state.storage.students || []).concat([response.data.payload.student]));

        $G.socketClient.emit('api:students:updated', response.data.payload.student);
        emitter.emit('application:toast', {
          title: response.data.title,
          message: response.data.message
        });
        return true;
      } catch(error) {
        return false;
      }
    },
  },
  modules: {},
  strict: true
});
