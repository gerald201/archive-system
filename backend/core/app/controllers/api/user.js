const models = require('../../../../database/models');
const { createHashAndSalt, checkWithHashAndSalt } = require('../../../../services/crypto');
const authenticationGuard = require('../../guards/authentication');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');

function count() {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;
        
        if(whereQueryData !== null) databaseQuery.where = whereQueryData;

        const count = await models.User.count(databaseQuery);

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {count}
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

function create() {
  return [
    roleGuard('super_administrator'),
    validationGuard({
      body: {
        schema: {
          $$strict: 'remove',
          index: 'string|empty:false|min:3',
          firstName: 'string|empty:false|min:3',
          lastName: 'string|empty:false|min:3',
          roleIds: {
            type: 'array',
            items: 'number|integer|positive|convert',
            optional: true,
            unique: true
          },
          userProfileTypeId: 'number|integer|positive|convert'
        }
      }
    }),
    async function(request, response, next) {
      try {
        const existingUser = await models.User.findOne({
          paranoid: false,
          where: {index: request.body.index}
        });
  
        if(existingUser) return next({name: 'ResourceUniqueViolationError'});

        const existingUserProfileType = await models.UserProfileType.findOne({
          paranoid: false,
          where: {id: request.body.userProfileTypeId}
        });

        if(!existingUserProfileType) return next({name: 'ResourceNotFoundError'});

        const roles = await models.Role.findAll({
          paranoid: false,
          where: {
            id: {[models.Sequelize.Op.in]: request.body.roleIds || []}
          }
        });
        const passwordHashAndSalt = createHashAndSalt(request.body.index);
        const user = await models.User.create({
          index: request.body.index,
          ...passwordHashAndSalt
        });
  
        await user.setRoles(roles);
        await user.createUserProfile({
          firstName: request.body.firstName,
          lastName: request.body.lastName,
          userProfileTypeId: request.body.userProfileTypeId
        });

        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };
        const excludedAttributes = [
          'hash',
          'salt'
        ];

        if(attributesQueryData !== null) {
          databaseQuery.attributes = attributesQueryData;
          databaseQuery.attributes.exclude = databaseQuery.attributes.exclude.concat(excludedAttributes
            .filter(function(attribute) {
              return !databaseQuery.attributes.exclude.includes(attribute);
            }));
          databaseQuery.attributes.include = databaseQuery.attributes.include
            .filter(function(attribute) {
              return !excludedAttributes.includes(attribute);
            });
        }
        else databaseQuery.attributes = {exclude: excludedAttributes};

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        await user.reload(databaseQuery);

        return response.respond({
          name: 'ResourceCreationSuccess',
          payload: {user}
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
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };
        const excludedAttributes = [
          'hash',
          'salt'
        ];

        if(attributesQueryData !== null) {
          databaseQuery.attributes = attributesQueryData;
          databaseQuery.attributes.exclude = databaseQuery.attributes.exclude.concat(excludedAttributes
            .filter(function(attribute) {
              return !databaseQuery.attributes.exclude.includes(attribute);
            }));
          databaseQuery.attributes.include = databaseQuery.attributes.include
            .filter(function(attribute) {
              return !excludedAttributes.includes(attribute);
            });
        }
        else databaseQuery.attributes = {exclude: excludedAttributes};

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        databaseQuery.where = {id: request.params.id};

        const user = await models.User.findOne(databaseQuery);

        if(!user) return next({name: 'ResourceNotFoundError'});

        await user.destroy();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          payload: {user}
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
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const orderQueryData = request.parseDatabaseQuery('order', request.query.order);
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const { limit: limitQueryData, offset: offsetQueryData } = request.parsePagination(request.query.pagination);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };
        const excludedAttributes = [
          'hash',
          'salt'
        ];

        if(attributesQueryData !== null) {
          databaseQuery.attributes = attributesQueryData;
          databaseQuery.attributes.exclude = databaseQuery.attributes.exclude.concat(excludedAttributes
            .filter(function(attribute) {
              return !databaseQuery.attributes.exclude.includes(attribute);
            }));
          databaseQuery.attributes.include = databaseQuery.attributes.include
            .filter(function(attribute) {
              return !excludedAttributes.includes(attribute);
            });
        }
        else databaseQuery.attributes = {exclude: excludedAttributes};

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        if(orderQueryData !== null) databaseQuery.order = orderQueryData;

        if(limitQueryData !== null) databaseQuery.limit = limitQueryData;
        
        if(whereQueryData !== null) databaseQuery.where = whereQueryData;

        if(offsetQueryData !== null) databaseQuery.offset = offsetQueryData;

        const users = await models.User.findAll(databaseQuery);

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {users}
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
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };
        const excludedAttributes = [
          'hash',
          'salt'
        ];

        if(attributesQueryData !== null) {
          databaseQuery.attributes = attributesQueryData;
          databaseQuery.attributes.exclude = databaseQuery.attributes.exclude.concat(excludedAttributes
            .filter(function(attribute) {
              return !databaseQuery.attributes.exclude.includes(attribute);
            }));
          databaseQuery.attributes.include = databaseQuery.attributes.include
            .filter(function(attribute) {
              return !excludedAttributes.includes(attribute);
            });
        }
        else databaseQuery.attributes = {exclude: excludedAttributes};

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        databaseQuery.where = {id: request.params.id};

        const user = await models.User.findOne(databaseQuery);

        if(!user) return next({name: 'ResourceNotFoundError'});

        await user.destroy({force: true});
        await user.UserProfile.destroy({force: true});
        return response.respond({
          name: 'ResourceObliterationSuccess',
          payload: {user}
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
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };
        const excludedAttributes = [
          'hash',
          'salt'
        ];

        if(attributesQueryData !== null) {
          databaseQuery.attributes = attributesQueryData;
          databaseQuery.attributes.exclude = databaseQuery.attributes.exclude.concat(excludedAttributes
            .filter(function(attribute) {
              return !databaseQuery.attributes.exclude.includes(attribute);
            }));
          databaseQuery.attributes.include = databaseQuery.attributes.include
            .filter(function(attribute) {
              return !excludedAttributes.includes(attribute);
            });
        }
        else databaseQuery.attributes = {exclude: excludedAttributes};

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        databaseQuery.where = {id: request.params.id};

        const user = await models.User.findOne(databaseQuery);

        if(!user) return next({name: 'ResourceNotFoundError'});

        await user.restore();
        return response.respond({
          name: 'ResourceRestorationSuccess',
          payload: {user}
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
          index: 'string|empty:false|min:3|optional',
          firstName: 'string|empty:false|min:3|optional',
          lastName: 'string|empty:false|min:3|optional',
          roleIds: {
            type: 'array',
            items: 'number|integer|positive|convert',
            optional: true,
            unique: true
          },
          userProfileTypeId: 'number|integer|positive|convert|optional'
        }
      }
    }),
    async function(request, response, next) {
      try {
        const user = await models.User.findOne({
          include: [
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
          where: {id: request.params.id}
        });

        if(!user) return next({name: 'ResourceNotFoundError'});

        let roles = null
        const userData = {};
        const userProfileData = {};

        if(request.body.index) {
          const existingUser = await models.User.findOne({
            paranoid: false,
            where: {index: request.body.index}
          });

          if(!existingUser) userData.index = request.body.index;
        }

        if(request.body.firstName) userProfileData.firstName = request.body.firstName;

        if(request.body.lastName) userProfileData.lastName = request.body.lastName;

        if(Array.isArray(request.body.roleIds)) {
          roles = await models.Role.findAll({
            paranoid: false,
            where: {
              id: {[models.Sequelize.Op.in]: request.body.roleIds || []}
            }
          });
        }

        if(request.body.userProfileTypeId) {
          const existingUserProfileType = await models.User.findOne({
            paranoid: false,
            where: {index: request.body.userProfileTypeId}
          });

          if(existingUserProfileType) userProfileData.userProfileTypeId = request.body.userProfileTypeId;
        }

        if(roles) await user.setRoles(roles);

        await user.update(userData);
        await user.UserProfile.update(userProfileData);

        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };
        const excludedAttributes = [
          'hash',
          'salt'
        ];

        if(attributesQueryData !== null) {
          databaseQuery.attributes = attributesQueryData;
          databaseQuery.attributes.exclude = databaseQuery.attributes.exclude.concat(excludedAttributes
            .filter(function(attribute) {
              return !databaseQuery.attributes.exclude.includes(attribute);
            }));
          databaseQuery.attributes.include = databaseQuery.attributes.include
            .filter(function(attribute) {
              return !excludedAttributes.includes(attribute);
            });
        }
        else databaseQuery.attributes = {exclude: excludedAttributes};

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        await user.reload(databaseQuery);

        return response.respond({
          name: 'ResourceUpdateSuccess',
          payload: {user}
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
    roleGuard('super_administrator'),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };
        const excludedAttributes = [
          'hash',
          'salt'
        ];

        if(attributesQueryData !== null) {
          databaseQuery.attributes = attributesQueryData;
          databaseQuery.attributes.exclude = databaseQuery.attributes.exclude.concat(excludedAttributes
            .filter(function(attribute) {
              return !databaseQuery.attributes.exclude.includes(attribute);
            }));
          databaseQuery.attributes.include = databaseQuery.attributes.include
            .filter(function(attribute) {
              return !excludedAttributes.includes(attribute);
            });
        }
        else databaseQuery.attributes = {exclude: excludedAttributes};

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        databaseQuery.where = {id: request.params.id};

        const user = await models.User.findOne(databaseQuery);

        if(!user) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {user}
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
  count,
  create,
  destroy,
  index,
  obliterate,
  restore,
  update,
  view
};
