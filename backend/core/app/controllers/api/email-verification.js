const moment = require('moment');
const models = require('../../../../database/models');
const { checkJWTToken, createJWTToken } = require('../../../../services/jwt');
const { sendMail } = require('../../../../services/nodemailer');
const authenticationGuard = require('../../guards/authentication');

function send() {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        if(request.user.emailVerifiedAt) {
          return response.send({
            title: 'Email Already Verified.',
            message: 'The email associated with this user has already been verified.',
            data: null
          });
        }

        const token = await createJWTToken('emailVerification', request.user.id);

        sendMail({
          from: 'Wabisque WebApp Template',
          to: request.user.email,
          subject: 'Verify your Email!',
          html: `
            Hello! 
            <a href="${request.protocol}://${request.headers.host}/api/email-verification/verify?token=${token.token}" target="__blank">
              Click Here To Verify Your Email
            </a>
          `
        });

        const responseData = {
          title: 'Email Verification Request Successful.',
          message: 'The email verification request has been successfully made.',
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
  ];
}

function verify() {
  return [
    async function(request, response, next) {
      try {
        const token = await checkJWTToken('emailVerification', request.query.token);

        if(!token) return next({name: 'invalidEmailVerificationToken'});

        const user = await token.getUser();

        if(!user.emailVerifiedAt) {
          await models.VerifiedEmail.create({
            email: user.email,
            userId: user.id
          });
          await user.update({emailVerifiedAt: moment().format()});
          await user.reload();
        }

        await token.revoke();

        const responseData = {
          title: 'Email Verification Successful',
          message: 'The email associated with this user has been successfully been verified.',
          data: {user: await user.toAPIData()}
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
  send,
  verify
};
