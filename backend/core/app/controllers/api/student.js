const models = require('../../../../database/models');
const { createHashAndSalt } = require('../../../../services/crypto');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');

function create() {
  return [
    roleGuard('super_administrator'),
    validationGuard({
      body: {
        schema: {
          $$strict: 'remove',
          index: {
            type: 'string',
            empty: false
          },
          firstName: {
            type: 'string',
            empty: 'false',
            min: 3
          },
          lastName: {
            type: 'string',
            empty: 'false',
            min: 3
          }
        }
      }
    }),
    async function(request, response, next) {
      try {
        const existingStudent = await models.User.findOne({
          paranoid: false,
          where: {index: request.body.index}
        });
  
        if(existingStudent) return next({name: 'ResourceUniqueViolationError'});
  
        const passwordHashAndSalt = createHashAndSalt(request.body.index);
        const student = await models.User.create({
          index: request.body.index,
          ...passwordHashAndSalt
        }, {
          attributes: {
            exclude: [
              'hash',
              'salt'
            ]
          },
          include: [
            {
              model: models.Role,
              as: 'Roles'
            },
            {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          ]
        });
  
        await student.addRole(await models.Role.findOne({
          where: {name: 'student'}
        }));
        await student.createUserProfile({
          firstName: request.body.firstName,
          lastName: request.body.lastName,
          userProfileTypeId: (await models.UserProfileType.findOne({
            where: {name: 'student'}
          })).id
        });
        await student.reload();

        const preppedStudent = student.toJSON();

        delete preppedStudent.hash;
        delete preppedStudent.salt;

        return response.respond({
          name: 'ResourceCreationSuccess',
          data: {student: preppedStudent}
        });
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

function destroy() {
  return [
    roleGuard('super_administrator'),
    async function(request, response, next) {
      try {
        const student = await models.User.findOne({
          attributes: {
            exclude: [
              'hash',
              'salt'
            ]
          },
          include: [
            {
              model: models.Role,
              as: 'Roles'
            },
            {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          ],
          where: {
            id: request.params.id,
            '$UserProfile.UserProfileType.name$': 'student'
          }
        });

        if(!student) return next({name: 'ResourceNotFoundError'});

        await student.destroy();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          data: {student}
        });
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

function index() {
  return [
    roleGuard('super_administrator'),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const orderQueryData = request.parseDatabaseQuery('order', request.query.order);
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const { limit: limitQueryData, offset: offsetQueryData } = request.parsePagination(request.query.pagination);
        const databaseQuery = {paranoid: false};

        if(attributesQueryData) {
          const excluded = [
            'hash',
            'salt'
          ];

          databaseQuery.attributes = attributesQueryData;
          databaseQuery.attributes.exclude = Array.isArray(databaseQuery.attributes.exclude) ? databaseQuery.attributes.exclude.concat(excluded) : excluded;

          if(databaseQuery.attributes.include) {
            databaseQuery.attributes.include = databaseQuery.attributes.include
              .filter(function(attribute) {
                return !excluded.includes(attribute);
              });
          }
        } else {
          databaseQuery.attributes = {
            exclude: [
              'hash',
              'salt'
            ]
          };
        }

        if(includeQueryData) databaseQuery.include = includeQueryData;
        else {
          databaseQuery.include = [
            {
              model: models.Role,
              as: 'Roles'
            },
            {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType',
                paranoid: false
              }
            }
          ];
        }

        if(orderQueryData) databaseQuery.order = orderQueryData;

        if(whereQueryData) {
          databaseQuery.where = {
            ...whereQueryData,
            '$UserProfile.UserProfileType.name$': 'student'
          };
        }
        else databaseQuery.where = {'$UserProfile.UserProfileType.name$': 'student'};

        if(limitQueryData) databaseQuery.limit = limitQueryData;

        if(offsetQueryData) databaseQuery.offset = offsetQueryData;

        const students = await models.User.findAll(databaseQuery);

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {students}
        });
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

function obliterate() {
  return [
    roleGuard('super_administrator'),
    async function(request, response, next) {
      try {
        const student = await models.User.findOne({
          attributes: {
            exclude: [
              'hash',
              'salt'
            ]
          },
          include: [
            {
              model: models.Role,
              as: 'Roles'
            },
            {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          ],
          paranoid: false,
          where: {
            id: request.params.id,
            '$UserProfile.UserProfileType.name$': 'student'
          }
        });

        if(!student) return next({name: 'ResourceNotFoundError'});

        await student.destroy({force: true});
        await student.UserProfile.destroy({force: true});
        return response.respond({
          name: 'ResourceObliterationSuccess',
          data: {student}
        });
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

function restore() {
  return [
    roleGuard('super_administrator'),
    async function(request, response, next) {
      try {
        const student = await models.User.findOne({
          attributes: {
            exclude: [
              'hash',
              'salt'
            ]
          },
          include: [
            {
              model: models.Role,
              as: 'Roles'
            },
            {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          ],
          paranoid: false,
          where: {
            id: request.params.id,
            '$UserProfile.UserProfileType.name$': 'student'
          }
        });

        if(!student) return next({name: 'ResourceNotFoundError'});

        await student.restore();
        return response.respond({
          name: 'ResourceRestorationSuccess',
          data: {program: student}
        });
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

function update() {
  return [
    roleGuard('super_administrator'),
    validationGuard({
      body: {
        schema: {
          $$strict: 'remove',
          index: {
            type: 'string',
            empty: false,
            optional: true
          },
          firstName: {
            type: 'string',
            empty: 'false',
            min: 3,
            optional: true
          },
          lastName: {
            type: 'string',
            empty: 'false',
            min: 3,
            optional: true
          }
        }
      }
    }),
    async function(request, response, next) {
      try {
        const student = await models.User.findOne({
          attributes: {
            exclude: [
              'hash',
              'salt'
            ]
          },
          include: [
            {
              model: models.Role,
              as: 'Roles'
            },
            {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          ],
          paranoid: false,
          where: {
            id: request.params.id,
            '$UserProfile.UserProfileType.name$': 'student'
          }
        });

        if(!student) return next({name: 'ResourceNotFoundError'});

        const userData = {};
        const userProfileData = Object.assign({}, request.body);

        delete userProfileData.index;

        if('index' in request.body) {
          const existingUser = await models.Course.findOne({index: request.body.index});

          if(existingUser && existingUser.id != student.id) return next({name: 'ResourceUniqueViolationError'});

          userData.index = request.body.index;
        }

        await student.update(userData);
        await student.UserProfile.update(userProfileData);

        return response.respond({
          name: 'ResourceUpdateSuccess',
          data: {student}
        });
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

function view() {
  return [
    async function(request, response, next) {
      try {
        const student = await models.User.findOne({
          attributes: {
            exclude: [
              'hash',
              'salt'
            ]
          },
          include: [
            {
              model: models.Role,
              as: 'Roles'
            },
            {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          ],
          paranoid: false,
          where: {
            id: request.params.id,
            '$UserProfile.UserProfileType.name$': 'student'
          }
        });

        if(!student) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {student}
        });
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

module.exports = {
  create,
  destroy,
  index,
  obliterate,
  restore,
  update,
  view
};
