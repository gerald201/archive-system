const { checkJWTToken } = require('../../../services/jwt');

function main() {
  return [
    async function(request, response, next) {
      try {
        const tokenString = (request.headers.authorization || '').split(' ')[1];
        const accessToken = await checkJWTToken('access', tokenString);

        if(!accessToken) return next({name: 'unauthenticated'});

        request.user = await accessToken.getUser();
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
