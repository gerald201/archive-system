import fastestValidator from 'fastest-validator';

export const validator = new fastestValidator();

export function validate(data, schema) {
  return validator.validate(data, schema);
}

export default {
  validate,
  validator
};
