const app = require(".");

function main(app) {
  app.set('api-key', '188d30cee8cccb7c191661923159d5f4b4f9624d7b6cc9b1cf5e24a1bc423e4b03583aad3ff4880a04c6e265bd1b0b3c46e1e6841e0016101105a134605ab3af');

  app.use(function(request, response, next) {
    if(request.headers['api-key'] != app.get('api-key')) return next({name: 'ApiKeyError'});

    return next();
  });
}

module.exports = main;
