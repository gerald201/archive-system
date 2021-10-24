const models = require('../../../../database/models');
const { checkWithHashAndSalt, createHashAndSalt } = require('../../../../services/crypto');
const authenticationGuard = require('../../guards/authentication');

function updateEmail() {
  return [
    authenticationGuard(),
    function(request, response, next) {
      const schema = {
        $$strict: 'remove',
        email: {
          type: 'email',
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
        const existingUser = await models.User.findOne({
          where: {email: request.body.email}
        });

        if(existingUser) return next({name: 'uniqueUserViolation'});

        const verifiedEmailCount = await request.user.countVerifiedEmails({
          where: {email: request.body.email}
        });

        await request.user.update({email: request.body.email});

        if(verifiedEmailCount == 0) await request.user.update({emailVerifiedAt: null});

        await request.user.reload();

        const responseData = {
          title: 'User Email Updated.',
          message: 'The email of the associated user has been successfully updated.',
          data: {user: await request.user.toAPIData()}
        };

        return response.send(responseData);
      } catch(error) {
        console.log(error);
        return next({
          name: 'serverError',
          error
        });
      }
    }
  ];
}

function updatePassword() {
  return [
    authenticationGuard(),
    function(request, response, next) {
      const schema = {
        $$strict: 'remove',
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
        },
        oldPassword: {
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
        if(!checkWithHashAndSalt(request.body.oldPassword, request.user.hash, request.user.salt)) return next({name: 'insufficientPermissions'});

        const newHashAndSalt = createHashAndSalt(request.body.password);

        await request.user.update({...newHashAndSalt});
        await request.user.reload();

        const responseData = {
          title: 'User Password Updated.',
          message: 'The password of the associated user has been successfully updated.',
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

function updateUsername() {
  return [
    authenticationGuard(),
    function(request, response, next) {
      const schema = {
        $$strict: 'remove',
        username: {
          type: 'string',
          empty: false,
          max: 25,
          min: 3
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
          where: {username: request.body.username}
        });

        if(existingUser) return next({name: 'uniqueUserViolation'});

        await request.user.update({username: request.body.username});
        await request.user.reload();

        const responseData = {
          title: 'User Username Updated.',
          message: 'The username of the associated user has been successfully updated.',
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
  updateEmail,
  updatePassword,
  updateUsername
};
