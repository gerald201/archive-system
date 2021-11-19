const fs = require('fs');
const path = require('path');
const models = require('../../../../database/models');
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

        const count = await models.Project.count(databaseQuery);

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
          name: 'string|empty:false',
          userId: 'number|integer|positive|convert'
        }
      },
      file: {
        handler: 'single',
        destination: 'projects',
        schema: {
          file: {extensions: 'pdf'}
        }
      }
    }),
    async function(request, response, next) {
      try {
        const user = await models.User.findOne({
          paranoid: false,
          include: {
            model: models.UserProfile,
            as: 'UserProfile',
            include: {
              model: models.UserProfileType,
              as: 'UserProfileType'
            }
          },
          where: {
            id: request.body.userId,
            '$UserProfile.UserProfileType.name$': 'student'
          }
        });
  
        if(!user) return next({name: 'ResourceNotFoundError'});
  
        const uploadsPath = path.join(__dirname, '../../../../storage/uploads');

        request.body.file = path.relative(uploadsPath, request.file.path);

        const project = await models.Project.create(request.body);
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) {
          const userIncludeIndex = includeQueryData
            .findIndex(function(include) {
              return include.model == models.User
            });

          if(userIncludeIndex >= 0) {
            const excludedUserAttributes = [
              'hash',
              'salt'
            ];
            
            if(includeQueryData[userIncludeIndex].attributes) {
              includeQueryData[userIncludeIndex].attributes.exclude = includeQueryData[userIncludeIndex].attributes.exclude.concat(excludedUserAttributes
                .filter(function(attribute) {
                  return !includeQueryData[userIncludeIndex].attributes.exclude.includes(attribute);
                }));
              includeQueryData[userIncludeIndex].attributes.include = includeQueryData[userIncludeIndex].attributes.include
                .filter(function(attribute) {
                  return !excludedUserAttributes.includes(attribute);
                });
            }
            else includeQueryData[userIncludeIndex].attributes = {exclude: excludedUserAttributes};
          }

          databaseQuery.include = includeQueryData;
        }
  
        await project.reload(databaseQuery);
        return response.respond({
          name: 'ResourceCreationSuccess',
          payload: {project}
        });
      } catch(error) {
        console.log(error);
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

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) {
          const userIncludeIndex = includeQueryData
            .findIndex(function(include) {
              return include.model == models.User
            });

          if(userIncludeIndex >= 0) {
            const excludedUserAttributes = [
              'hash',
              'salt'
            ];
            
            if(includeQueryData[userIncludeIndex].attributes) {
              includeQueryData[userIncludeIndex].attributes.exclude = includeQueryData[userIncludeIndex].attributes.exclude.concat(excludedUserAttributes
                .filter(function(attribute) {
                  return !includeQueryData[userIncludeIndex].attributes.exclude.includes(attribute);
                }));
              includeQueryData[userIncludeIndex].attributes.include = includeQueryData[userIncludeIndex].attributes.include
                .filter(function(attribute) {
                  return !excludedUserAttributes.includes(attribute);
                });
            }
            else includeQueryData[userIncludeIndex].attributes = {exclude: excludedUserAttributes};
          }

          databaseQuery.include = includeQueryData;
        }

        databaseQuery.where = {id: request.params.id};

        const project = await models.Project.findOne(databaseQuery);

        if(!project) return next({name: 'ResourceNotFoundError'});

        await project.destroy();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          payload: {project}
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

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) {
          const userIncludeIndex = includeQueryData
            .findIndex(function(include) {
              return include.model == models.User
            });

          if(userIncludeIndex >= 0) {
            const excludedUserAttributes = [
              'hash',
              'salt'
            ];
            
            if(includeQueryData[userIncludeIndex].attributes) {
              includeQueryData[userIncludeIndex].attributes.exclude = includeQueryData[userIncludeIndex].attributes.exclude.concat(excludedUserAttributes
                .filter(function(attribute) {
                  return !includeQueryData[userIncludeIndex].attributes.exclude.includes(attribute);
                }));
              includeQueryData[userIncludeIndex].attributes.include = includeQueryData[userIncludeIndex].attributes.include
                .filter(function(attribute) {
                  return !excludedUserAttributes.includes(attribute);
                });
            }
            else includeQueryData[userIncludeIndex].attributes = {exclude: excludedUserAttributes};
          }

          databaseQuery.include = includeQueryData;
        }

        if(orderQueryData !== null) databaseQuery.order = orderQueryData;

        if(whereQueryData !== null) databaseQuery.where = whereQueryData;

        if(limitQueryData !== null) databaseQuery.limit = limitQueryData;

        if(offsetQueryData !== null) databaseQuery.offset = offsetQueryData;

        const projects = await models.Project.findAll(databaseQuery);
        
        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {projects}
        });
      } catch(error) {
        console.log(error);
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
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) {
          const userIncludeIndex = includeQueryData
            .findIndex(function(include) {
              return include.model == models.User
            });

          if(userIncludeIndex >= 0) {
            const excludedUserAttributes = [
              'hash',
              'salt'
            ];
            
            if(includeQueryData[userIncludeIndex].attributes) {
              includeQueryData[userIncludeIndex].attributes.exclude = includeQueryData[userIncludeIndex].attributes.exclude.concat(excludedUserAttributes
                .filter(function(attribute) {
                  return !includeQueryData[userIncludeIndex].attributes.exclude.includes(attribute);
                }));
              includeQueryData[userIncludeIndex].attributes.include = includeQueryData[userIncludeIndex].attributes.include
                .filter(function(attribute) {
                  return !excludedUserAttributes.includes(attribute);
                });
            }
            else includeQueryData[userIncludeIndex].attributes = {exclude: excludedUserAttributes};
          }

          databaseQuery.include = includeQueryData;
        }

        databaseQuery.where = {id: request.params.id};

        const project = await models.Project.findOne(databaseQuery);

        if(!project) return next({name: 'ResourceNotFoundError'});

        fs.unlink(path.join(__dirname, '../../../../storage/uploads', project.file), function(error) {});
        await project.destroy({force: true});
        return response.respond({
          name: 'ResourceObliterationSuccess',
          payload: {project}
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
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) {
          const userIncludeIndex = includeQueryData
            .findIndex(function(include) {
              return include.model == models.User
            });

          if(userIncludeIndex >= 0) {
            const excludedUserAttributes = [
              'hash',
              'salt'
            ];
            
            if(includeQueryData[userIncludeIndex].attributes) {
              includeQueryData[userIncludeIndex].attributes.exclude = includeQueryData[userIncludeIndex].attributes.exclude.concat(excludedUserAttributes
                .filter(function(attribute) {
                  return !includeQueryData[userIncludeIndex].attributes.exclude.includes(attribute);
                }));
              includeQueryData[userIncludeIndex].attributes.include = includeQueryData[userIncludeIndex].attributes.include
                .filter(function(attribute) {
                  return !excludedUserAttributes.includes(attribute);
                });
            }
            else includeQueryData[userIncludeIndex].attributes = {exclude: excludedUserAttributes};
          }

          databaseQuery.include = includeQueryData;
        }

        databaseQuery.where = {id: request.params.id};

        const project = await models.Project.findOne(databaseQuery);

        if(!project) return next({name: 'ResourceNotFoundError'});

        await project.restore();
        return response.respond({
          name: 'ResourceRestorationSuccess',
          payload: {project}
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
          name: 'string|empty:false|optional',
          userId: 'number|integer|positive|convert|optional'
        }
      },
      file: {
        handler: 'single',
        destination: 'projects',
        schema: {
          file: {
            extensions: 'pdf',
            optional: true
          }
        }
      }
    }),
    async function(request, response, next) {
      try {
        const project = await models.Project.findOne({
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!project) return next({name: 'ResourceNotFoundError'});

        const projectData = {};

        if(request.body.name) projectData.name = request.body.name;
        
        if(request.body.userId) {
          const user = await models.User.findOne({
            paranoid: false,
            where: {
              id: request.body.userId,
              '$UserProfile.UserProfileType.name$': 'student'
            }
          });

          if(user) projectData.userId = request.body.userId;
        }

        if(request.file) {
          const uploadsPath = path.join(__dirname, '../../../../storage/uploads');

          fs.unlink(path.join(uploadsPath, project.file), function(error) {});
          projectData.file = path.relative(uploadsPath, request.file.path);
        }

        await project.update(request.body);

        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) {
          const userIncludeIndex = includeQueryData
            .findIndex(function(include) {
              return include.model == models.User
            });

          if(userIncludeIndex >= 0) {
            const excludedUserAttributes = [
              'hash',
              'salt'
            ];
            
            if(includeQueryData[userIncludeIndex].attributes) {
              includeQueryData[userIncludeIndex].attributes.exclude = includeQueryData[userIncludeIndex].attributes.exclude.concat(excludedUserAttributes
                .filter(function(attribute) {
                  return !includeQueryData[userIncludeIndex].attributes.exclude.includes(attribute);
                }));
              includeQueryData[userIncludeIndex].attributes.include = includeQueryData[userIncludeIndex].attributes.include
                .filter(function(attribute) {
                  return !excludedUserAttributes.includes(attribute);
                });
            }
            else includeQueryData[userIncludeIndex].attributes = {exclude: excludedUserAttributes};
          }

          databaseQuery.include = includeQueryData;
        }

        await project.reload(databaseQuery);
        return response.respond({
          name: 'ResourceUpdateSuccess',
          payload: {project}
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
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) {
          const userIncludeIndex = includeQueryData
            .findIndex(function(include) {
              return include.model == models.User
            });

          if(userIncludeIndex >= 0) {
            const excludedUserAttributes = [
              'hash',
              'salt'
            ];
            
            if(includeQueryData[userIncludeIndex].attributes) {
              includeQueryData[userIncludeIndex].attributes.exclude = includeQueryData[userIncludeIndex].attributes.exclude.concat(excludedUserAttributes
                .filter(function(attribute) {
                  return !includeQueryData[userIncludeIndex].attributes.exclude.includes(attribute);
                }));
              includeQueryData[userIncludeIndex].attributes.include = includeQueryData[userIncludeIndex].attributes.include
                .filter(function(attribute) {
                  return !excludedUserAttributes.includes(attribute);
                });
            }
            else includeQueryData[userIncludeIndex].attributes = {exclude: excludedUserAttributes};
          }

          databaseQuery.include = includeQueryData;
        }

        databaseQuery.where = {id: request.params.id};

        const project = await models.Project.findOne(databaseQuery);

        if(!project) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {project}
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
