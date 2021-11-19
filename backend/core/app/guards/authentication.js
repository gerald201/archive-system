const moment = require('moment');
const { checkJWTToken } = require('../../../services/jwt');

function main() {
  return [
    async function(request, response, next) {
      try {
        const tokenString = (request.headers.authorization || '').split(' ')[1];
        const accessToken = await checkJWTToken('access', tokenString);

        if(!accessToken) return next({name: 'AuthorizationNotFoundError'});

        request.user = await accessToken.getUser() || null;

        if(!request.user) return next({name: 'AuthorizationNotFoundError'});
        
        return next();
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

module.exports = main;
