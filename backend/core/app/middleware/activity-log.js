const models = require('../../../database/models');
const emitterService = require('../../../services/emitter');
const { checkJWTToken } = require('../../../services/jwt');

function main() {
  return [
    async function(request, response, next) {
      const tokenString = (request.headers.authorization || '').split(' ')[1];
      const accessToken = await checkJWTToken('access', tokenString);
      const user = await accessToken?.getUser();

      emitterService.on('database-event', async function(data) {
        try {
          await models.ActivityLog.create({
            type: 'database',
            data: {
              userId: user?.id ?? null,
              ...data
            },
          });
        } catch(error) {}
      });

      response.on('finish', async function() {
        try {
          await models.ActivityLog.create({
            type: 'route',
            data: {
              userId: user?.id ?? null,
              url: request.originalUrl,
              method: request.method,
              statusCode: response.statusCode
            },
          });
        } catch(error) {}
      });

      return next();
    }
  ];
}

module.exports = main;
