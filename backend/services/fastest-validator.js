const fastestValidator = require('fastest-validator');

const validator = new fastestValidator();

function validate(data, schema) {
  return validator.validate(data, schema);
}

module.exports = {
  validate,
  validator
};
