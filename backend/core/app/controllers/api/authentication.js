const moment = require('moment');
const models = require('../../../../database/models');
const { checkWithHashAndSalt, createHashAndSalt } = require('../../../../services/crypto');
const { checkJWTToken, createJWTToken } = require('../../../../services/jwt');
const authenticationGuard = require('../../guards/authentication');
const validationGuard = require('../../guards/validation');

function refresh() {
  return [
    async function (request, response, next) {
      try {
        if(!request.query.token) return next({name: 'AuthorizationRenewalError'});

        const refreshToken = await checkJWTToken('refresh', request.query.token);

        if(!refreshToken) return next({name: 'AuthorizationRenewalError'});

        const accessToken = await createJWTToken('access', refreshToken.userId);

        return response.respond({
          name: 'AuthorizationRenewalSuccess',
          payload: {
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
          index: 'string|empty:false',
          password: 'string|empty:false'
        }
      }
    }),
    async function(request, response, next) {
      try {
        const user = await models.User.findOne({
          where: {index: request.body.index}
        });
  
        if(!user) return next({name: 'AuthenticationValidityError'});
  
        if(!checkWithHashAndSalt(request.body.password, user.hash, user.salt)) return next({name: 'AuthenticationConsistencyError'});
  
        const accessToken = await createJWTToken('access', user.id);
        const refteshToken = await createJWTToken('refresh', user.id);
        
        await user.reload({
          attributes: {
            exclude: [
              'hash',
              'salt'
            ]
          },
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
          ]
        });

        return response.respond({
          name: 'AuthenticationSuccess',
          payload: {
            token: {
              access: accessToken,
              refresh: refteshToken
            },
            user
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
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ]
}

function updatePassword() {
  return [
    authenticationGuard(),
    validationGuard({
      body: {
        $$strict: 'remove',
        newPassword: {
          type: 'string',
          empty: false,
          min: 6,
          pattern: /^.*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/,
          messages: {stringPattern: 'The \'{field}\' field must have at least one lowercase letter, one uppercase letter and one digit.'}
        },
        currentPassword: 'string|empty:false'
      }
    }),
    async function(request, response, next) {
      try {
        if(!checkWithHashAndSalt(request.body.currentPassword, request.user.hash, request.user.salt)) return next({name: 'AuthenticationConsistencyError'});

        const passwordHash = createHashAndSalt(request.body.newPassword);

        await request.user.update(passwordHash);
        return response.respond({name: 'AuthorizedUserUpdateSuccess'});
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

function whoami() {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        await request.user.reload({
          attributes: {
            exclude: [
              'hash',
              'salt'
            ]
          },
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
          ]
        });
        return response.respond({
          name: 'AuthorizedUserRetrievalSuccess',
          payload: {user: request.user}
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
  updatePassword,
  whoami
};
