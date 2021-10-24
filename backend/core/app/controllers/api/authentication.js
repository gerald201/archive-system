const models = require('../../../../database/models');
const { checkWithHashAndSalt, createHashAndSalt } = require('../../../../services/crypto');
const { checkJWTToken, createJWTToken } = require('../../../../services/jwt');
const authenticationGuard = require('../../guards/authentication');

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
    function(request, response, next) {
      const schema = {
        $$strict: 'remove',
        emailOrUsername: {
          type: 'string',
          empty: false
        },
        password: {
          type: 'string',
          empty: false
        }
      };
      const validated = request.validate(schema);

      if(validated !== true) {
        return next({
          name: 'invalidRequestBody',
          error: validated
        });
      }

      return next();
    },
    async function(request, response, next) {
      try {
        const user = await models.User.findOne({
          where: {
            [models.Sequelize.Op.or]: [
              {email: request.body.emailOrUsername},
              {username: request.body.emailOrUsername}
            ]
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
            user: await user.toAPIData()
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
        await request.user.revokeAllAccessTokens();
        await request.user.revokeAllRefreshTokens();

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

function signUp() {
  return [
    function(request, response, next) {
      const schema = {
        $$strict: 'remove',
        email: {
          type: 'email',
          empty: 'false',
          min: 3
        },
        password: {
          type: 'string',
          empty: false,
          min: 6,
          pattern: /^.*(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/,
          messages: {
            stringPattern: 'The \'{field}\' field must have at least one lowercase letter, one uppercase letter and one digit.'
          }
        },
        confirmPassword: {
          type: 'equal',
          field: 'password'
        }
      };
      const validated = request.validate(schema);

      if(validated !== true) {
        return next({
          name: 'invalidRequestBody',
          error: validated
        });
      }

      return next();
    },
    async function(request, response, next) {
      try {
        const existingUser = await models.User.findOne({
          where: {email: request.body.email}
        });

        if(existingUser) return next({name: 'uniqueUserViolation'});

        await models.VerifiedEmail.destroy({
          where: {email: request.body.email}
        });

        const passwordHashAndSalt = createHashAndSalt(request.body.password);
        const user = await models.User.create({
          email: request.body.email,
          hash: passwordHashAndSalt.hash,
          salt: passwordHashAndSalt.salt
        });

        await user.reload();
        await user.addRole(await models.Role.findOne({
          where: {name: 'consumer'}
        }));

        const accessToken = await createJWTToken('access', user.id);
        const refreshToken = await createJWTToken('refresh', user.id);
        const responseData = {
          title: 'Sign Up Successful.',
          message: 'User has been successfully signed up.',
          data: {
            token: {
              access: accessToken,
              refresh: refreshToken
            },
            user: await user.toAPIData()
          }
        };

        return response
          .status(201)
          .send(responseData);
      } catch(error) {
        return next({
          name: 'serverError',
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
        const responseData = {
          title: 'User Retrieval Successful.',
          message: 'User data has been successfully retrieved.',
          data: {user: await request.user.toAPIData()}
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
  signUp,
  whoami
};
