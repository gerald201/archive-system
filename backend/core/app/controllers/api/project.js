const fs = require('fs');
const path = require('path');
const models = require('../../../../database/models');
const authenticationGuard = require('../../guards/authentication');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');

function create() {
  return [
    roleGuard('super_administrator'),
    validationGuard({
      body: {
        schema: {
          $$strict: 'remove',
          name: {
            type: 'string',
            empty: false
          },
          userId: {
            type: 'number',
            integer: true,
            positive: true
          }
        }
      },
      file: {
        handle: 'single',
        destination: 'projects',
        schema: {
          file: {extensions: 'pdf'}
        }
      }
    }),
    async function(request, response, next) {
      try {
        const student = await models.User.findOne({
          paranoid: false,
          where: {
            id: request.body.userId,
            '$UserProfile.UserProfileType.name$': 'student'
          }
        });
  
        if(!student) return next({name: 'ResourceNotFoundError'});
  
        const uploadsPath = path.join(__dirname, '../../../../storage/uploads');

        request.body.file = path.relative(uploadsPath, request.file.path);

        const project = await models.Project.create(request.body, {
          include: {
            model: models.User,
            as: 'User',
            attributes: {
              exclude: [
                'hash',
                'salt'
              ]
            },
            include: {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          }
        });
  
        await project.reload();
        return response.respond({
          name: 'ResourceCreationSuccess',
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

function destroy() {
  return [
    roleGuard('super_administrator'),
    async function(request, response, next) {
      try {
        const project = await models.Project.findOne({
          include: {
            model: models.User,
            as: 'User',
            attributes: {
              exclude: [
                'hash',
                'salt'
              ]
            },
            include: {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          },
          paranoid: false,
          where: {id: request.params.id}
        });

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
        const databaseQuery = {paranoid: false};

        if(attributesQueryData) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData) databaseQuery.include = includeQueryData;
        else {
          databaseQuery.include = {
            model: models.User,
            as: 'User',
            attributes: {
              exclude: [
                'hash',
                'salt'
              ]
            },
            include: {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          };
        }

        if(orderQueryData) databaseQuery.order = orderQueryData;

        if(whereQueryData) databaseQuery.where = whereQueryData;

        if(limitQueryData) databaseQuery.limit = limitQueryData;

        if(offsetQueryData) databaseQuery.offset = offsetQueryData;

        const projects = await models.Project.findAll(databaseQuery);
        
        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {projects}
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
    async function(request, response, next) {
      try {
        const project = await models.Project.findOne({
          include: {
            model: models.User,
            as: 'User',
            attributes: {
              exclude: [
                'hash',
                'salt'
              ]
            },
            include: {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          },
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!project) return next({name: 'ResourceNotFoundError'});

        fs.rm(path.join(__dirname, '../../../../storage/uploads', project.file), function(error) {});
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
        const project = await models.Project.findOne({
          include: {
            model: models.User,
            as: 'User',
            attributes: {
              exclude: [
                'hash',
                'salt'
              ]
            },
            include: {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          },
          paranoid: false,
          where: {id: request.params.id}
        });

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
          name: {
            type: 'string',
            empty: false,
            optional: true
          },
          userId: {
            type: 'number',
            optional: true,
            integer: true,
            positive: true
          }
        }
      },
      file: {
        handle: 'single',
        destination: 'question-banks',
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
          include: {
            model: models.User,
            as: 'User',
            attributes: {
              exclude: [
                'hash',
                'salt'
              ]
            },
            include: {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          },
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!project) return next({name: 'ResourceNotFoundError'});

        if('userId' in request.body) {
          const user = await models.User.findOne({
            paranoid: false,
            where: {
              id: request.body.userId,
              '$UserProfile.UserProfileType.name$': 'student'
            }
          });

          if(!user) return next({name: 'ResourceNotFoundError'});
        }

        if(request.file) {
          const uploadsPath = path.join(__dirname, '../../../../storage/uploads');

          fs.rm(path.join(uploadsPath, project.file), function(error) {});
          request.body.file = path.relative(uploadsPath, request.file.path);
        }

        await project.update(request.body);
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
        const project = await models.Project.findOne({
          include: {
            model: models.User,
            as: 'User',
            attributes: {
              exclude: [
                'hash',
                'salt'
              ]
            },
            include: {
              model: models.UserProfile,
              as: 'UserProfile',
              include: {
                model: models.UserProfileType,
                as: 'UserProfileType'
              }
            }
          },
          paranoid: false,
          where: {id: request.params.id}
        });

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
  create,
  destroy,
  index,
  obliterate,
  restore,
  update,
  view
};
