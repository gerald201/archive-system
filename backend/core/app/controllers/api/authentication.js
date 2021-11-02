const moment = require('moment');
const models = require('../../../../database/models');
const { checkWithHashAndSalt } = require('../../../../services/crypto');
const { checkJWTToken, createJWTToken } = require('../../../../services/jwt');
const authenticationGuard = require('../../guards/authentication');
const validationGuard = require('../../guards/validation');

function refresh() {
  return [
    async function (request, response, next) {
      try {
        if(!request.query.token?.toString?.()) return next({name: 'AuthorizationRenewalError'});

        const refreshToken = await checkJWTToken('refresh', request.query.token.toString());

        if(!refreshToken) return next({name: 'AuthorizationRenewalError'});

        const user = await refreshToken.getUser();
        const accessToken = await createJWTToken('access', user.id);

        return response.respond({
          name: 'AuthorizationRenewalSuccess',
          data: {
            token: {access: accessToken}
          }
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
          where: {index: request.body.index}
        });
  
        if(!user) return next({name: 'AuthenticationValidityError'});
  
        if(!checkWithHashAndSalt(request.body.password, user.hash, user.salt)) return next({name: 'AuthenticationConsistencyError'});
  
        const accessToken = await createJWTToken('access', user.id);
        const refteshToken = await createJWTToken('refresh', user.id);
        const preppedUser = user.toJSON();

        delete preppedUser.hash;
        delete preppedUser.salt;

        return response.respond({
          name: 'AuthenticationSuccess',
          data: {
            token: {
              access: accessToken,
              refresh: refteshToken
            },
            user: preppedUser
          }
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

        return response.respond({name: 'AuthorizationRevocationSuccess'});
      } catch(error) {
        console.log(error);
        return next({
          name: 'ServerError',
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
        const preppedUser = request.user.toJSON();

        delete preppedUser.hash;
        delete preppedUser.salt;
        return response.respond({
          name: 'AuthorizedUserRetrievalSuccess',
          data: {user: preppedUser}
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
  refresh,
  signIn,
  signOut,
  whoami
};
