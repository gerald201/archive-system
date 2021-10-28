module.exports = {
  serverError: {
    status: 500,
    message: 'There has been an internal server error.'
  },
  invalidRequestFormBody: {
    status: 422,
    message: 'The request body provided has errors.'
  },
  invalidRequestFormData: {
    status: 422,
    message: 'The request form files provided has errors.'
  },
  uniqueUserViolation: {
    status: 409,
    message: 'User already exists.'
  },
  insufficientPermissions: {
    status: 403,
    message: 'You have insufficient permissions to access this resource.'
  },
  unauthenticated: {
    status: 403,
    message: 'You are not authorized to access this resource.'
  },
  inconsistentCredentials: {
    status: 401,
    message: 'The provided credentials do not match the found user record.'
  },
  invalidCredentials: {
    status: 401,
    message: 'There is no such user with the provided credentials.'
  },
  badRequest: {
    status: 400,
    message: 'The submitted request either has a defect or is made to a non-existent route.'
  },
  invalidEmailVerificationToken: {
    status: 400,
    message: 'The submitted email verification token is either invalid or expired.'
  },
  invalidRefreshToken: {
    status: 400,
    message: 'The submitted refresh token is either invalid or expired.'
  },
  resourceNotFound: {
    status: 400,
    message: 'The requested resource was not found.'
  }
};