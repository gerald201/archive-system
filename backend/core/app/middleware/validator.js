const fastestValidatorService = require('../../../services/fastest-validator');

function main() {
  return [
    function(request, response, next) {
      request.validate = function(schema) {
        return fastestValidatorService.validate(request.body, schema);
      }
  
      return next();
    }
  ];
}

module.exports = main;
