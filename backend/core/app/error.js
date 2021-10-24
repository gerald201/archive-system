const errorMap = require('../../resources/data/error-map');

function main(app) {
  app.use(function(request, response, next) {
    return next({});
  });
  
  app.use(function(error, request, response, next) {
    const name = errorMap.hasOwnProperty(error?.name) ? error.name: 'badRequest';
    const errorData = errorMap[name];

    return response
      .status(errorData.status)
      .send({
        title: name
          .replace(/([A-Z])/, ' $1')
          .replace(/^[a-z]/, function(m) {
            return m.toUpperCase();
          }),
        message: errorData.message,
        data: {
          errorType: name,
          error: error?.error ?? null
        }
      });
  });
}

module.exports = main;
