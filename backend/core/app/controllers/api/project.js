const models = require('../../../../database/models');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');

function create() {
  return [
    roleGuard({allowed: 'super_administrator'}),
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

module.exports = {
  create
};
