const models = require('../../../../database/models');
const { checkWithHashAndSalt, createHashAndSalt } = require('../../../../services/crypto');
const { checkJWTToken, createJWTToken } = require('../../../../services/jwt');
const authenticationGuard = require('../../guards/authentication');
const validationGuard = require('../../guards/validation');

function refresh() {
  return [
    async function (request, response, next) {
      try {
        if(!request.query.token?.toString?.()) return next({name: 'invalidRefreshToken'});

        const refreshToken = await checkJWTToken('refresh', request.query.token.toString());

        if(!refreshToken) return next({name: 'invalidRefreshToken'});

        const user = await refreshToken.getUser();
        const accessToken = await createJWTToken('access', user.id);
        const responseData = {
          title: 'Refresh Successful.',
          message: 'authentication has been successfully refreshed.',
          data: {
            token: {access: accessToken}
          }
        };

        return response.send(responseData);
      } catch(error) {
        return next({
          name: 'serverError',
          error
        });
      }
    }
  ];
}

function signIn() {
  return [
    validationGuard({
      body: {
        schema: {
          $$strict: 'remove',
          index: {
            type: 'string',
            empty: false
          },
          password: {
            type: 'string',
            empty: false
          }
        }
      }
    }),
    async function(request, response, next) {
      try {
        const user = await models.User.findOne({
          where: {
            index: request.body.index
          }
        });
  
        if(!user) return next({name: 'invalidCredentials'});
  
        if(!checkWithHashAndSalt(request.body.password, user.hash, user.salt)) return next({name: 'inconsistentCredentials'});
  
        const accessToken = await createJWTToken('access', user.id);
        const refteshToken = await createJWTToken('refresh', user.id);
        const responseData = {
          title: 'Sign In Successful.',
          message: 'User has been successfully signed in.',
          data: {
            token: {
              access: accessToken,
              refresh: refteshToken
            },
            user: await user.toDescriptiveJSON()
          }
        };

        return response.send(responseData);
      } catch(error) {
        return next({
          name: 'serverError',
          error
        });
      }
    }
  ];
}

function signOut() {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        await models.AccessToken.update({revokedAt: moment().format()}, {
          where: {
            revokedAt: null,
            userId: request.user.id
          }
        });
        await models.RefreshToken.update({revokedAt: moment().format()}, {
          where: {
            revokedAt: null,
            userId: request.user.id
          }
        });

        const responseData = {
          title: 'Sign Out Successful.',
          message: 'User has been successfully signed out.',
          data: null
        };

        return response.send(responseData);
      } catch(error) {
        return next({
          name: 'serverError',
          error
        });
      }
    }
  ]
}

function whoami() {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const responseData = {
          title: 'User Retrieval Successful.',
          message: 'User data has been successfully retrieved.',
          data: {user: await request.user.toDescriptiveJSON()}
        };

        return response.send(responseData);
      } catch(error) {
        return next({
          name: 'serverError',
          error
        });
      }
    }
  ];
}

module.exports = {
  refresh,
  signIn,
  signOut,
  whoami
};
