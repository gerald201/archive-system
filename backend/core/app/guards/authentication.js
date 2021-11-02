const models = require('../../../database/models');
const { checkJWTToken } = require('../../../services/jwt');

function main() {
  return [
    async function(request, response, next) {
      try {
        const tokenString = (request.headers.authorization || '').split(' ')[1];
        const accessToken = await checkJWTToken('access', tokenString);

        if(!accessToken) return next({name: 'AuthorizationNotFoundError'});

        request.user = await models.User.findOne({
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
          where: {id: accessToken.userId}
        });
        return next();
      } catch(error) {
        return {
          name: 'serverError',
          error
        };
      }
    }
  ];
}

module.exports = main;
