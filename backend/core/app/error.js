const errorMessageMap = require('../../resources/data/error-message-map');

function main(app) {
  app.use(function(request, response, next) {
    return next({});
  });
  
  app.use(function(error, request, response, next) {
    const name = ((error?.name?.toString() ?? '') in errorMessageMap) ? error.name: 'RequestError';
    const messageData = errorMessageMap[name];

    return response
      .status(messageData.status)
      .send({
        title: name
          .replace(/([A-Z])/, ' $1')
          .trim(),
        message: messageData.message,
        data: {
          errorType: name,
          error: error?.error ? {...error.error} : null
        }
      });
  });
}

module.exports = main;
