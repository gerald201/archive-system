function main(schema) {
  return [
    function(request, response, next) {
      const validated = request.validate(schema);

      if(validated !== true) {
        return next({
          name: 'invalidRequestBody',
          error: validated
        });
      }

      return next();
    }
  ];
}

module.exports = main;
