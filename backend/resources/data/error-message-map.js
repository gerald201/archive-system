module.exports = {
  AuthenticationConsistencyError: {
    status: 401,
    message: 'There is an inconsistency with the provided authentication credentials.'
  },
  AuthenticationValidityError: {
    status: 401,
    message: 'There are no matching valid values for the provided authentiction credentials.'
  },
  AuthorizationNotFoundError: {
    status: 403,
    message: 'There is no authorized user.'
  },
  AuthorizationRenewalError: {
    status: 401,
    message: 'There has been an error with the renewal of authorization.'
  },
  PermissionSufficiencyError: {
    status: 403,
    message: 'The authorized user has insufficient permissions to fulfill this request.'
  },
  RequestFormDataError: {
    status: 422,
    message: 'There are some errors found in the provided form data.'
  },
  ResourceNotFoundError: {
    status: 404,
    message: 'The requested resource cannot be found.'
  },
  ResourceUniqueViolationError: {
    status: 409,
    message: 'There already exists a resource with these values.'
  },
  ServerError: {
    status: 500,
    message: 'There has been an internal server error.'
  }
};
