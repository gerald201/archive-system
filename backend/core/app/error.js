const errorMessageMap = require('../../resources/data/error-message-map');

function main(app) {
  app.use(function(request, response, next) {
    return next({});
  });
  
  app.use(function(error, request, response, next) {
    const name = errorMessageMap.hasOwnProperty(error?.name?.toString() ?? '') ? error.name: 'badRequest';
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
