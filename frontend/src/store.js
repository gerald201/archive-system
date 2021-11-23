import axios from 'axios';
import { createStore } from 'vuex';
import { emitter } from '@/services/emitter';

function getApiEventData(type) {
  const typesMap = {
    courses: {
      include: [
        {
          model: 'Level',
          as: 'Level'
        },
        {
          model: 'Program',
          as: 'Program'
        },
        {
          model: 'Semester',
          as: 'Semester'
        }
      ],
      where: {}
    },
    levels: {
      include: [],
      where: {}
    },
    programs: {
      include: [],
      where: {}
    },
    projects: {

      include: [
        {
          model: 'User',
          as: 'User',
          include: [
            {
              model: 'Role',
              as: 'Roles'
            },
            {
              model: 'UserProfile',
              as: 'UserProfile',
              include: {
                model: 'UserProfileType',
                as: 'UserProfileType'
              }
            }
          ]
        }
      ],
      where: {}
    },
    'question-banks': {

      include: [
        {
          model: 'Course',
          as: 'Course',
          include: [
            {
              model: 'Level',
              as: 'Level'
            },
            {
              model: 'Program',
              as: 'Program'
            },
            {
              model: 'Semester',
              as: 'Semester'
            }
          ]
        }
      ],
      where: {}
    },
    roles: {
      include: [],
      where: {}
    },
    semesters: {
      include: [],
      where: {}
    },
    users: {

      include: [
        {
          model: 'Role',
          as: 'Roles'
        },
        {
          model: 'UserProfile',
          as: 'UserProfile',
          include: {
            model: 'UserProfileType',
            as: 'UserProfileType'
          }
        }
      ],
      where: {'$UserProfile.UserProfileType.name$': 'student'}
    },
    'user-profile-types': {
      include: [],
      where: {}
    }
  };

  if(!(type in typesMap)) return null;

  return {
    action: type
      .replace(/-\w/gi, function(match) {
        return match[1].toUpperCase();
      })
      .replace(/^[a-z]/, function(match) {
        return match.toUpperCase();
      }),
    count: type
      .replace(/-\w/gi, function(match) {
        return match[1].toUpperCase();
      })
      .replace(/s$/, '') + 'Count',
    countMutation: type
      .replace(/-/g, '_')
      .replace(/s$/, '')
      .toUpperCase() + '_COUNT',
    effect: typesMap[type].include
      .map(function(item) {
        return item.model
          .replace(/[A-Z]/g, function(match) {
            return `-${match.toLowerCase()}`;
          })
          .replace(/^-/, '');
      })
      .filter(function(item) {
        return item in typesMap;
      }),
    include: typesMap[type].include,
    mutation: type
      .replace(/-/g, '_')
      .toUpperCase(),
    plural: type
      .replace(/-\w/gi, function(match) {
        return match[1].toUpperCase();
      }),
    singular: type
      .replace(/-\w/gi, function(match) {
        return match[1].toUpperCase();
      })
      .replace(/s$/, ''),
    url: `api/${type}`,
    where: typesMap[type].where
  }
}

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
    settings: {},
    storage: {
      authenticationToken: null,
      authenticationUser: null,
      courseCount: null,
      courses: null,
      levelCount: null,
      levels: null,
      programCount: null,
      programs: null,
      projectCount:null,
      projects: null,
      questionBankCount:null,
      questionBanks: null,
      roleCount: null,
      roles: null,
      semesterCount: null,
      semesters: null,
      userCount:null,
      users: null,
      userProfileTypeCount: null,
      userProfileTypes: null
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
    resourcePageSize() {
      return 20;
    }
  },
  mutations: {
    ADD_STORAGE_COURSES(state, payload) {
      if(!Array.isArray(payload)) return;

      state.storage.levels = (state.storage.levels || [])
        .filter(function(level) {
          return !payload
            .some(function(item) {
              return item.Level.id == level.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Level.id;
              }) ? accumulator : accumulator.concat([current.Level]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.programs = (state.storage.programs || [])
        .filter(function(program) {
          return !payload
            .some(function(item) {
              return item.Program.id == program.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Program.id;
              }) ? accumulator : accumulator.concat([current.Program]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.semesters = (state.storage.semesters || [])
        .filter(function(semester) {
          return !payload
            .some(function(item) {
              return item.Semester.id == semester.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Semester.id;
              }) ? accumulator : accumulator.concat([current.Semester]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.courses = (state.storage.courses || [])
        .filter(function(course) {
          return !payload
            .some(function(item) {
              return item.id == course.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    ADD_STORAGE_LEVELS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.levels = (state.storage.levels || [])
        .filter(function(level) {
          return !payload
            .some(function(item) {
              return item.id == level.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    ADD_STORAGE_PROGRAMS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.programs = (state.storage.programs || [])
        .filter(function(program) {
          return !payload
            .some(function(item) {
              return item.id == program.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    ADD_STORAGE_PROJECTS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.roles = (state.storage.roles || [])
        .filter(function(existingRole) {
          return !payload
            .some(function(item) {
              return item.User.Roles
                .some(function(role) {
                  return role.id == existingRole.id;
                });
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator.concat(current.User.Roles
              .filter(function(role) {
                return !accumulator
                  .some(function(accumulated) {
                    return accumulated.id == role.id;
                  });
              }));
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.userProfileTypes = (state.storage.userProfileTypes || [])
        .filter(function(userProfileType) {
          return !payload
            .some(function(item) {
              return item.User.UserProfile.UserProfileType.id == userProfileType.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.User.UserProfile.UserProfileType.id;
              }) ? accumulator : accumulator.concat([current.User.UserProfile.UserProfileType]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.users = (state.storage.users || [])
        .filter(function(user) {
          return !payload
            .some(function(item) {
              return item.User.id == user.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.User.id;
              }) ? accumulator : accumulator.concat([current.User]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.projects = (state.storage.projects || [])
        .filter(function(project) {
          return !payload
            .some(function(item) {
              return item.id == project.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    ADD_STORAGE_QUESTION_BANKS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.levels = (state.storage.levels || [])
        .filter(function(level) {
          return !payload
            .some(function(item) {
              return item.Course.Level.id == level.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.Level.id;
              }) ? accumulator : accumulator.concat([current.Course.Level]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.programs = (state.storage.programs || [])
        .filter(function(program) {
          return !payload
            .some(function(item) {
              return item.Course.Program.id == program.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.Program.id;
              }) ? accumulator : accumulator.concat([current.Course.Program]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.semesters = (state.storage.semesters || [])
        .filter(function(semester) {
          return !payload
            .some(function(item) {
              return item.Course.Semester.id == semester.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.Semester.id;
              }) ? accumulator : accumulator.concat([current.Course.Semester]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.courses = (state.storage.courses || [])
        .filter(function(course) {
          return !payload
            .some(function(item) {
              return item.Course.id == course.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.id;
              }) ? accumulator : accumulator.concat([current.Course]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.questionBanks = (state.storage.questionBanks || [])
        .filter(function(questionBank) {
          return !payload
            .some(function(item) {
              return item.id == questionBank.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    ADD_STORAGE_ROLES(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.roles = (state.storage.roles || [])
        .filter(function(role) {
          return !payload
            .some(function(item) {
              return item.id == role.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    ADD_STORAGE_SEMESTERS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.semesters = (state.storage.semesters || [])
        .filter(function(semester) {
          return !payload
            .some(function(item) {
              return item.id == semester.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    ADD_STORAGE_USERS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.roles = (state.storage.roles || [])
        .filter(function(existingRole) {
          return !payload
            .some(function(item) {
              return item.Roles
                .some(function(role) {
                  return role.id == existingRole.id;
                });
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator.concat(current.Roles
              .filter(function(role) {
                return !accumulator
                  .some(function(accumulated) {
                    return accumulated.id == role.id;
                  });
              }));
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.userProfileTypes = (state.storage.userProfileTypes || [])
        .filter(function(userProfileType) {
          return !payload
            .some(function(item) {
              return item.UserProfile.UserProfileType.id == userProfileType.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.UserProfile.UserProfileType.id;
              }) ? accumulator : accumulator.concat([current.UserProfile.UserProfileType]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.users = (state.storage.users || [])
        .filter(function(user) {
          return !payload
            .some(function(item) {
              return item.id == user.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    ADD_STORAGE_USER_PROFILE_TYPES(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.userProfileTypes = (state.storage.userProfileTypes || [])
        .filter(function(userProfileType) {
          return !payload
            .some(function(item) {
              return item.id == userProfileType.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    REPLACE_STORAGE_COURSES(state, payload) {
      if(!Array.isArray(payload)) return;

      state.storage.levels = (state.storage.levels || [])
        .filter(function(level) {
          return !payload
            .some(function(item) {
              return item.Level.id == level.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Level.id;
              }) ? accumulator : accumulator.concat([current.Level]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.programs = (state.storage.programs || [])
        .filter(function(program) {
          return !payload
            .some(function(item) {
              return item.Program.id == program.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Program.id;
              }) ? accumulator : accumulator.concat([current.Program]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.semesters = (state.storage.semesters || [])
        .filter(function(semester) {
          return !payload
            .some(function(item) {
              return item.Semester.id == semester.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Semester.id;
              }) ? accumulator : accumulator.concat([current.Semester]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.courses = (state.storage.courses || [])
        .filter(function(course) {
          return !payload
            .some(function(item) {
              return item.id == course.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, [])
          .filter(function(item) {
            return (state.storage.courses || [])
              .some(function(course) {
                return course.id == item.id;
              })
          }))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    REPLACE_STORAGE_LEVELS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.levels = (state.storage.levels || [])
        .filter(function(level) {
          return !payload
            .some(function(item) {
              return item.id == level.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, [])
          .filter(function(item) {
            return (state.storage.levels || [])
              .some(function(level) {
                return level.id == item.id;
              })
          }))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    REPLACE_STORAGE_PROGRAMS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.programs = (state.storage.programs || [])
        .filter(function(program) {
          return !payload
            .some(function(item) {
              return item.id == program.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, [])
          .filter(function(item) {
            return (state.storage.programs || [])
              .some(function(program) {
                return program.id == item.id;
              })
          }))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    REPLACE_STORAGE_PROJECTS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.roles = (state.storage.roles || [])
        .filter(function(existingRole) {
          return !payload
            .some(function(item) {
              return item.User.Roles
                .some(function(role) {
                  return role.id == existingRole.id;
                });
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator.concat(current.User.Roles
              .filter(function(role) {
                return !accumulator
                  .some(function(accumulated) {
                    return accumulated.id == role.id;
                  });
              }));
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.userProfileTypes = (state.storage.userProfileTypes || [])
        .filter(function(userProfileType) {
          return !payload
            .some(function(item) {
              return item.User.UserProfile.UserProfileType.id == userProfileType.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.User.UserProfile.UserProfileType.id;
              }) ? accumulator : accumulator.concat([current.User.UserProfile.UserProfileType]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.users = (state.storage.users || [])
        .filter(function(user) {
          return !payload
            .some(function(item) {
              return item.User.id == user.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.User.id;
              }) ? accumulator : accumulator.concat([current.User]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.projects = (state.storage.projects || [])
        .filter(function(project) {
          return !payload
            .some(function(item) {
              return item.id == project.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, [])
          .filter(function(item) {
            return (state.storage.projects || [])
              .some(function(project) {
                return project.id == item.id;
              })
          }))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    REPLACE_STORAGE_QUESTION_BANKS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.levels = (state.storage.levels || [])
        .filter(function(level) {
          return !payload
            .some(function(item) {
              return item.Course.Level.id == level.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.Level.id;
              }) ? accumulator : accumulator.concat([current.Course.Level]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.programs = (state.storage.programs || [])
        .filter(function(program) {
          return !payload
            .some(function(item) {
              return item.Course.Program.id == program.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.Program.id;
              }) ? accumulator : accumulator.concat([current.Course.Program]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.semesters = (state.storage.semesters || [])
        .filter(function(semester) {
          return !payload
            .some(function(item) {
              return item.Course.Semester.id == semester.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.Semester.id;
              }) ? accumulator : accumulator.concat([current.Course.Semester]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.courses = (state.storage.courses || [])
        .filter(function(course) {
          return !payload
            .some(function(item) {
              return item.Course.id == course.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.id;
              }) ? accumulator : accumulator.concat([current.Course]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.questionBanks = (state.storage.questionBanks || [])
        .filter(function(questionBank) {
          return !payload
            .some(function(item) {
              return item.id == questionBank.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, [])
          .filter(function(item) {
            return (state.storage.questionBanks || [])
              .some(function(questionBank) {
                return questionBank.id == item.id;
              })
          }))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    REPLACE_STORAGE_ROLES(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.roles = (state.storage.roles || [])
        .filter(function(role) {
          return !payload
            .some(function(item) {
              return item.id == role.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, [])
          .filter(function(item) {
            return (state.storage.roles || [])
              .some(function(role) {
                return role.id == item.id;
              })
          }))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    REPLACE_STORAGE_SEMESTERS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.semesters = (state.storage.semesters || [])
        .filter(function(semester) {
          return !payload
            .some(function(item) {
              return item.id == semester.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, [])
          .filter(function(item) {
            return (state.storage.semesters || [])
              .some(function(semester) {
                return semester.id == item.id;
              })
          }))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    REPLACE_STORAGE_USERS(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.roles = (state.storage.roles || [])
        .filter(function(existingRole) {
          return !payload
            .some(function(item) {
              return item.Roles
                .some(function(role) {
                  return role.id == existingRole.id;
                });
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator.concat(current.Roles
              .filter(function(role) {
                return !accumulator
                  .some(function(accumulated) {
                    return accumulated.id == role.id;
                  });
              }));
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.userProfileTypes = (state.storage.userProfileTypes || [])
        .filter(function(userProfileType) {
          return !payload
            .some(function(item) {
              return item.UserProfile.UserProfileType.id == userProfileType.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.UserProfile.UserProfileType.id;
              }) ? accumulator : accumulator.concat([current.UserProfile.UserProfileType]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.users = (state.storage.users || [])
        .filter(function(user) {
          return !payload
            .some(function(item) {
              return item.id == user.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, [])
          .filter(function(item) {
            return (state.storage.users || [])
              .some(function(user) {
                return user.id == item.id;
              })
          }))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    REPLACE_STORAGE_USER_PROFILE_TYPES(state, payload) {
      if(!Array.isArray(payload)) return;
      
      state.storage.userProfileTypes = (state.storage.userProfileTypes || [])
        .filter(function(userProfileType) {
          return !payload
            .some(function(item) {
              return item.id == userProfileType.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.id;
              }) ? accumulator : accumulator.concat([current]);
          }, [])
          .filter(function(item) {
            return (state.storage.userProfileTypes || [])
              .some(function(userProfileType) {
                return userProfileType.id == item.id;
              })
          }))
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
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
      state.storage.authenticationToken = payload || null;
    },
    SET_STORAGE_AUTHENTICATION_USER(state, payload) {
      state.storage.authenticationUser = payload || null;
    },
    SET_STORAGE_COURSE_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.courseCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_COURSES(state, payload) {
      if(!Array.isArray(payload)) {
        state.storage.courses = null;
        return;
      }

      state.storage.levels = (state.storage.levels || [])
        .filter(function(level) {
          return !payload
            .some(function(item) {
              return item.Level.id == level.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Level.id;
              }) ? accumulator : accumulator.concat([current.Level]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.programs = (state.storage.programs || [])
        .filter(function(program) {
          return !payload
            .some(function(item) {
              return item.Program.id == program.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Program.id;
              }) ? accumulator : accumulator.concat([current.Program]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.semesters = (state.storage.semesters || [])
        .filter(function(semester) {
          return !payload
            .some(function(item) {
              return item.Semester.id == semester.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Semester.id;
              }) ? accumulator : accumulator.concat([current.Semester]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.courses = payload
        .reduce(function(accumulator, current) {
          return accumulator
            .some(function(accumulated) {
              return accumulated.id == current.id;
            }) ? accumulator : accumulator.concat([current]);
        }, [])
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    SET_STORAGE_LEVEL_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.levelCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_LEVELS(state, payload) {
      if(!Array.isArray(payload)) {
        state.storage.levels = null;
        return;
      }

      state.storage.levels = payload
        .reduce(function(accumulator, current) {
          return accumulator
            .some(function(accumulated) {
              return accumulated.id == current.id;
            }) ? accumulator : accumulator.concat([current]);
        }, [])
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    SET_STORAGE_PROGRAM_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.programCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_PROGRAMS(state, payload) {
      if(!Array.isArray(payload)) {
        state.storage.programs = null;
        return;
      }

      state.storage.programs = payload
        .reduce(function(accumulator, current) {
          return accumulator
            .some(function(accumulated) {
              return accumulated.id == current.id;
            }) ? accumulator : accumulator.concat([current]);
        }, [])
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    SET_STORAGE_PROJECT_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.projectCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_PROJECTS(state, payload) {
      if(!Array.isArray(payload)) {
        state.storage.projects = null;
        return;
      }

      state.storage.roles = (state.storage.roles || [])
        .filter(function(existingRole) {
          return !payload
            .some(function(item) {
              return item.User.Roles
                .some(function(role) {
                  return role.id == existingRole.id;
                });
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator.concat(current.User.Roles
              .filter(function(role) {
                return !accumulator
                  .some(function(accumulated) {
                    return accumulated.id == role.id;
                  });
              }));
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.userProfileTypes = (state.storage.userProfileTypes || [])
        .filter(function(userProfileType) {
          return !payload
            .some(function(item) {
              return item.User.UserProfile.UserProfileType.id == userProfileType.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.User.UserProfile.UserProfileType.id;
              }) ? accumulator : accumulator.concat([current.User.UserProfile.UserProfileType]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.users = (state.storage.users || [])
        .filter(function(user) {
          return !payload
            .some(function(item) {
              return item.User.id == user.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.User.id;
              }) ? accumulator : accumulator.concat([current.User]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.projects = payload
        .reduce(function(accumulator, current) {
          return accumulator
            .some(function(accumulated) {
              return accumulated.id == current.id;
            }) ? accumulator : accumulator.concat([current]);
        }, [])
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    SET_STORAGE_QUESTION_BANK_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.questionBankCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_QUESTION_BANKS(state, payload) {
      if(!Array.isArray(payload)) {
        state.storage.questionBanks = null;
        return;
      }

      state.storage.levels = (state.storage.levels || [])
        .filter(function(level) {
          return !payload
            .some(function(item) {
              return item.Course.Level.id == level.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.Level.id;
              }) ? accumulator : accumulator.concat([current.Course.Level]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.programs = (state.storage.programs || [])
        .filter(function(program) {
          return !payload
            .some(function(item) {
              return item.Course.Program.id == program.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.Program.id;
              }) ? accumulator : accumulator.concat([current.Course.Program]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.semesters = (state.storage.semesters || [])
        .filter(function(semester) {
          return !payload
            .some(function(item) {
              return item.Course.Semester.id == semester.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.Semester.id;
              }) ? accumulator : accumulator.concat([current.Course.Semester]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.courses = (state.storage.courses || [])
        .filter(function(course) {
          return !payload
            .some(function(item) {
              return item.Course.id == course.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.Course.id;
              }) ? accumulator : accumulator.concat([current.Course]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.questionBanks = payload
        .reduce(function(accumulator, current) {
          return accumulator
            .some(function(accumulated) {
              return accumulated.id == current.id;
            }) ? accumulator : accumulator.concat([current]);
        }, [])
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    SET_STORAGE_ROLE_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.roleCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_ROLES(state, payload) {
      if(!Array.isArray(payload)) {
        state.storage.roles = null;
        return;
      }

      state.storage.roles = payload
        .reduce(function(accumulator, current) {
          return accumulator
            .some(function(accumulated) {
              return accumulated.id == current.id;
            }) ? accumulator : accumulator.concat([current]);
        }, [])
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    SET_STORAGE_SEMESTER_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.semesterCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_SEMESTERS(state, payload) {
      if(!Array.isArray(payload)) {
        state.storage.semesters = null;
        return;
      }

      state.storage.semesters = payload
        .reduce(function(accumulator, current) {
          return accumulator
            .some(function(accumulated) {
              return accumulated.id == current.id;
            }) ? accumulator : accumulator.concat([current]);
        }, [])
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    SET_STORAGE_USER_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.userCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_USERS(state, payload) {
      if(!Array.isArray(payload)) {
        state.storage.users = null;
        return;
      }

      state.storage.roles = (state.storage.roles || [])
        .filter(function(existingRole) {
          return !payload
            .some(function(item) {
              return item.Roles
                .some(function(role) {
                  return role.id == existingRole.id;
                });
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator.concat(current.Roles
              .filter(function(role) {
                return !accumulator
                  .some(function(accumulated) {
                    return accumulated.id == role.id;
                  });
              }));
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.userProfileTypes = (state.storage.userProfileTypes || [])
        .filter(function(userProfileType) {
          return !payload
            .some(function(item) {
              return item.UserProfile.UserProfileType.id == userProfileType.id;
            });
        })
        .concat(payload
          .reduce(function(accumulator, current) {
            return accumulator
              .some(function(accumulated) {
                return accumulated.id == current.UserProfile.UserProfileType.id;
              }) ? accumulator : accumulator.concat([current.UserProfile.UserProfileType]);
          }, []))
        .sort(function(a, b) {
          return a.id - b.id;
        });
      state.storage.users = payload
        .reduce(function(accumulator, current) {
          return accumulator
            .some(function(accumulated) {
              return accumulated.id == current.id;
            }) ? accumulator : accumulator.concat([current]);
        }, [])
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
    SET_STORAGE_USER_PROFILE_TYPE_COUNT(state, payload) {
      if(payload !== null && isNaN(parseInt(payload))) return;

      state.storage.userProfileTypeCount = payload === null ? null : parseInt(payload);
    },
    SET_STORAGE_USER_PROFILE_TYPES(state, payload) {
      if(!Array.isArray(payload)) {
        state.storage.userProfileTypes = null;
        return;
      }

      state.storage.userProfileTypes = payload
        .reduce(function(accumulator, current) {
          return accumulator
            .some(function(accumulated) {
              return accumulated.id == current.id;
            }) ? accumulator : accumulator.concat([current]);
        }, [])
        .sort(function(a, b) {
          return a.id - b.id;
        });
    },
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
        return true;
      } catch(error) {
        return false;
      }
    },
    async authenticationSignIn(context, payload) {
      try {
        const response = await axios.post('/api/authentication/sign-in', payload, {
          headers: {'Content-Type': 'multipart/form-data'}
        });

        context.commit('SET_STORAGE_AUTHENTICATION_TOKEN', response.data.payload.token);
        context.commit('SET_STORAGE_AUTHENTICATION_USER', response.data.payload.user);
        emitter.emit('application:toast', {
          title: response.data.title,
          message: response.data.message
        });
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
    async authenticationUpdateUser(context, payload) {
      try {
        const response = await axios.patch('/api/authentication/update-password', payload, {
          headers: {'Content-Type': 'multipart/form-data'}
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
    async authenticationWhoami(context) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const response = await axios.get('/api/authentication/whoami');

        context.commit('SET_STORAGE_AUTHENTICATION_USER', response.data.payload.user);
        return true;
      } catch(error) {
        return false;
      }
    },
    async createResource(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const superAdministratorRoleCheck = context.state.storage.authenticationUser?.Roles
          .some(function(role) {
            return role.name == 'super_administrator';
          });

        if(!superAdministratorRoleCheck) return false;

        const body = payload?.body ?? null;
        const type = payload?.type ?? '';
        const eventData = getApiEventData(type);

        if(!eventData) return false;

        if(type == 'users') {
          await Promise.all([
            context.dispatch('requestAllResource', {type: 'roles'}),
            context.dispatch('requestAllResource', {type: 'user-profile-types'})
          ]);

          body.append('roleIds[]', JSON.stringify(context.state.storage.roles
            .reduce(function(accumulator, current) {
              return current.name == 'student' ? current.id : accumulator;
            }, null)));
          body.append('userProfileTypeId', context.state.storage.userProfileTypes
            .reduce(function(accumulator, current) {
              return current.name == 'student' ? current.id : accumulator;
            }, null));
        }

        const response = await axios.post(`${eventData.url}/create`, body, {
          headers: {'Content-Type': 'multipart/form-data'},
          params: {include: JSON.stringify(eventData.include)}
        });
        const resource = response.data.payload[eventData.singular];

        context.commit(`ADD_STORAGE_${eventData.mutation}`, [resource]);
        await context.dispatch('requestResourceCount', {type});
        $G.socketClient.emit('app:resource:create', {
          resource,
          type
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
    async destroyResource(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const superAdministratorRoleCheck = context.state.storage.authenticationUser?.Roles
          .some(function(role) {
            return role.name == 'super_administrator';
          });

        if(!superAdministratorRoleCheck) return false;

        const type = payload?.type ?? '';
        const id = payload?.id ?? null;
        const eventData = getApiEventData(type);

        if(!eventData || id === null) return false;

        const response = await axios.delete(`${eventData.url}/destroy/${id}`, {
          params: {include: JSON.stringify(eventData.include)}
        });
        const resource = response.data.payload[eventData.singular];

        context.commit(`REPLACE_STORAGE_${eventData.mutation}`, [resource]);
        await context.dispatch('requestResourceCount', {type});
        $G.socketClient.emit('app:resource:update', {
          resource,
          type
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
    async recoverResource(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const type = payload?.type ?? '';
        const eventData = getApiEventData(type);

        if(!eventData) return false;

        if(context.state.storage[eventData.plural] !== null && context.state.storage[eventData.count] !== null && context.state.storage[eventData.plural].length >= context.state.storage[eventData.count]) return true;

        const lowerLimit = (context.state.storage[eventData.plural] || [])
          .reduce(function(accumulator, current, index) {
            if(index == 0) return current.id;

            return accumulator < current.id ? accumulator : current.id;
          }, 0);
        const upperLimit = (context.state.storage[eventData.plural] || [])
          .reduce(function(accumulator, current, index) {
            if(index == 0) return current.id;

            return accumulator > current.id ? accumulator : current.id;
          }, 0);

        const paginationParam = {
          page: 1,
          size: context.getters.resourcePageSize
        };
        
        eventData.where.id = {
          $notIn: (context.state.storage[eventData.plural] || [])
            .map(function(item) {
              return item.id;
            }),
          $gte: lowerLimit,
          $lte: upperLimit
        };

        if(context.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student') eventData.where.deletedAt = null;

        const response = await axios.get(`${eventData.url}`, {
          params: {
            include: JSON.stringify(eventData.include),
            pagination: JSON.stringify(paginationParam),
            where: JSON.stringify(eventData.where)
          }
        });
        const resources = response.data.payload[eventData.plural];

        context.commit(`ADD_STORAGE_${eventData.mutation}`, resources);
        await context.dispatch('requestResourceCount', {type});
        return true;
      } catch(error) {
        return false;
      }
    },
    async refreshAllResource(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const type = payload?.type ?? '';
        const eventData = getApiEventData(type);

        if(!eventData) return false;

        if(context.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student') eventData.where.deletedAt = null;

        const response = await axios.get(`${eventData.url}`, {
          params: {
            include: JSON.stringify(eventData.include),
            where: JSON.stringify(eventData.where)
          }
        });
        const resources = response.data.payload[eventData.plural];

        context.commit(`SET_STORAGE_${eventData.mutation}`, resources);
        await context.dispatch('requestResourceCount', {type});
        return true;
      } catch(error) {
        return false;
      }
    },
    async refreshResource(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const type = payload?.type ?? '';
        const eventData = getApiEventData(type);

        if(!eventData) return false;

        eventData.where.id = {
          $in: (context.state.storage[eventData.plural] || [])
            .map(function(item) {
              return item.id;
            })
        }

        if(context.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student') eventData.where.deletedAt = null;

        const response = await axios.get(`${eventData.url}`, {
          params: {
            include: JSON.stringify(eventData.include),
            where: JSON.stringify(eventData.where)
          }
        });
        const resources = response.data.payload[eventData.plural];

        context.commit(`SET_STORAGE_${eventData.mutation}`, resources);
        await context.dispatch('requestResourceCount', {type});
        return true;
      } catch(error) {
        return false;
      }
    },
    async requestAllResource(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const type = payload?.type ?? '';
        const eventData = getApiEventData(type);

        if(!eventData) return false;

        if(context.state.storage[eventData.plural] !== null && context.state.storage[eventData.count] !== null && context.state.storage[eventData.plural].length >= context.state.storage[eventData.count]) return true;

        eventData.where.id = {
          $notIn: (context.state.storage[eventData.plural] || [])
            .map(function(item) {
              return item.id;
            })
        };

        if(context.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student') eventData.where.deletedAt = null;

        const response = await axios.get(`${eventData.url}`, {
          params: {
            include: JSON.stringify(eventData.include),
            where: JSON.stringify(eventData.where)
          }
        });
        const resources = response.data.payload[eventData.plural];

        context.commit(`ADD_STORAGE_${eventData.mutation}`, resources);
        await context.dispatch('requestResourceCount', {type});
        return true;
      } catch(error) {
        return false;
      }
    },
    async requestResource(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const type = payload?.type ?? '';
        const eventData = getApiEventData(type);

        if(!eventData) return false;

        if(context.state.storage[eventData.plural] !== null && context.state.storage[eventData.count] !== null && context.state.storage[eventData.plural].length >= context.state.storage[eventData.count]) return true;

        const paginationParam = {
          page: 1,
          size: context.getters.resourcePageSize
        };
        
        eventData.where.id = {
          $notIn: (context.state.storage[eventData.plural] || [])
            .map(function(item) {
              return item.id;
            })
        };

        if(context.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student') eventData.where.deletedAt = null;

        const response = await axios.get(`${eventData.url}`, {
          params: {
            include: JSON.stringify(eventData.include),
            pagination: JSON.stringify(paginationParam),
            where: JSON.stringify(eventData.where)
          }
        });
        const resources = response.data.payload[eventData.plural];

        context.commit(`ADD_STORAGE_${eventData.mutation}`, resources);
        await context.dispatch('requestResourceCount', {type});
        return true;
      } catch(error) {
        return false;
      }
    },
    async requestResourceCount(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const type = payload?.type ?? '';
        const eventData = getApiEventData(type);

        if(!eventData) return false;

        if(context.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student') eventData.where.deletedAt = null;

        const response = await axios.get(`${eventData.url}/count`, {
          params: {
            include: JSON.stringify(eventData.include),
            where: JSON.stringify(eventData.where)
          }
        });
        const count = response.data.payload.count;

        context.commit(`SET_STORAGE_${eventData.countMutation}`, count);
        return true;
      } catch(error) {
        return false;
      }
    },
    async restoreResource(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const superAdministratorRoleCheck = context.state.storage.authenticationUser?.Roles
          .some(function(role) {
            return role.name == 'super_administrator';
          });

        if(!superAdministratorRoleCheck) return false;

        const id = payload.id ?? null;
        const type = payload?.type ?? '';
        const eventData = getApiEventData(type);

        if(!eventData || id === null) return false;

        const response = await axios.post(`${eventData.url}/restore/${id}`, null, {
          params: {include: JSON.stringify(eventData.include)}
        });
        const resource = response.data.payload[eventData.singular];

        context.commit(`REPLACE_STORAGE_${eventData.mutation}`, [resource]);
        await context.dispatch('requestResourceCount', {type});
        $G.socketClient.emit('app:resource:update', {
          resource,
          type
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
    async searchResource(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const type = payload?.type ?? '';
        const searchWhereQuery = payload?.searchWhereQuery ?? null;
        const eventData = getApiEventData(type);

        if(!eventData || !searchWhereQuery) return false;

        if(context.state.storage[eventData.plural] !== null && context.state.storage[eventData.count] !== null && context.state.storage[eventData.plural].length >= context.state.storage[eventData.count]) return true;

        const paginationParam = {
          page: 1,
          size: context.getters.resourcePageSize
        };
        const whereParam = {
          ...searchWhereQuery,
          ...eventData.where,
          id: {
            $notIn: (context.state.storage[eventData.plural] || [])
              .map(function(item) {
                return item.id;
              })
          }
        }

        if(context.state.storage.authenticationUser?.UserProfile?.UserProfileType?.name == 'student') whereParam.deletedAt = null;

        const response = await axios.get(`${eventData.url}`, {
          params: {
            include: JSON.stringify(eventData.include),
            pagination: JSON.stringify(paginationParam),
            where: JSON.stringify(whereParam)
          }
        });
        const resources = response.data.payload[eventData.plural];

        context.commit(`ADD_STORAGE_${eventData.mutation}`, resources);
        await context.dispatch('requestResourceCount', {type});
        return true;
      } catch(error) {
        return false;
      }
    },
    async updateResource(context, payload) {
      try {
        if(!context.getters.authenticationAccessTokenAvailable) return false;

        const superAdministratorRoleCheck = context.state.storage.authenticationUser?.Roles
          .some(function(role) {
            return role.name == 'super_administrator';
          });

        if(!superAdministratorRoleCheck) return false;

        const body = payload?.body ?? null;
        const id = payload?.id ?? null;
        const type = payload?.type ?? '';
        const eventData = getApiEventData(type);

        if(!eventData || id === null) return false;

        if(type == 'users') {
          await Promise.all([
            context.dispatch('requestAllResource', {type: 'roles'}),
            context.dispatch('requestAllResource', {type: 'user-profile-types'})
          ]);
        }

        const response = await axios.patch(`${eventData.url}/update/${id}`, body, {
          headers: {'Content-Type': 'multipart/form-data'},
          params: {include: JSON.stringify(eventData.include)}
        });
        const resource = response.data.payload[eventData.singular];

        context.commit(`REPLACE_STORAGE_${eventData.mutation}`, [resource]);
        await context.dispatch('requestResourceCount', {type});
        $G.socketClient.emit('app:resource:update', {
          resource,
          type
        });
        emitter.emit('application:toast', {
          title: response.data.title,
          message: response.data.message
        });
        return true;
      } catch(error) {
        return false;
      }
    }
  },
  modules: {},
  strict: true
});
