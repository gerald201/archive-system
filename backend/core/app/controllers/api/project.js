const models = require('../../../../database/models');
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
        const user = await models.User.findByPk(request.body.userId);
        const userProfile = await user?.getProfile();
        const userProfileType = await userProfile?.getUserProfileType();
  
        if(!(user && userProfile && userProfileType) || userProfileType.name != 'student') return next({name: 'ResourceNotFoundError'});
  
        const uploadsPath = path.join(__dirname, '../../../../storage/uploads');

        request.body.file = path.relative(uploadsPath, request.file.path);

        const project = await models.Project.create(request.body);
  
        return response.respond({
          name: 'ResourceCreationSuccess',
          data: {project: project.toJSON()}
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
        const project = await models.Project.findByPk(request.params.id);

        if(!project) return next({name: 'ResourceNotFoundError'});

        await project.destroy();
        await project.reload();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          data: {project: project.toJSON()}
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
    roleGuard([
      'super_administrator',
      'student'
    ]),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const orderQueryData = request.parseDatabaseQuery('order', request.query.order);
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const { limit: limitQueryData, offset: offsetQueryData } = request.parsePagination(request.query.pagination);
        const databaseQuery = {};

        if(attributesQueryData) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData) databaseQuery.include = includeQueryData;
        else {
          databaseQuery.include = {
            model: models.User,
            as: 'User'
          };
        }

        if(orderQueryData) databaseQuery.order = orderQueryData;

        if(whereQueryData) databaseQuery.where = whereQueryData;

        if(limitQueryData) databaseQuery.limit = limitQueryData;

        if(offsetQueryData) databaseQuery.offset = offsetQueryData;

        const projects = await models.Project.findAll(databaseQuery);
        
        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {projects}
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
        const project = await models.Project.findByPk(request.params.id);

        if(!project) return next({name: 'ResourceNotFoundError'});

        if('userId' in request.body) {
          const user = await models.User.findByPk(request.body.userId);
          const userProfile = await user?.getProfile();
          const userProfileType = await userProfile?.getUserProfileType();

          if(!(user && userProfile && userProfileType) || userProfileType.name != 'student') return next({name: 'ResourceNotFoundError'});
        }

        if(request.file) {
          const uploadsPath = path.join(__dirname, '../../../../storage/uploads');
          fs.rm(path.join(uploadsPath, project.file));
          request.body.file = path.relative(uploadsPath, request.file.path);
        }

        await project.update(request.body);
        await project.reload();
        return response.respond({
          name: 'ResourceUpdateSuccess',
          data: {project: project.toJSON()}
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
        const project = await models.Project.findByPk(request.params.id);

        if(!project) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {project: project.toJSON()}
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
  update,
  view
};
