const dotenv = require('dotenv');
const jwtConfigurationValueMap = require('../resources/data/jwt-configuration-value-map');

dotenv.config();

function parseValue(value) {
  if(typeof value != 'string' || !value) return 0;

  return /^(\d+)(\w)$/
    .exec(value)
    .filter(function(match, index) {
      return index > 0;
    })
    .reduce(function(accumulator, match) {
      const matchAsInt = parseInt(match);

      return accumulator * (isNaN(matchAsInt) ? (jwtConfigurationValueMap[match] || 0) : matchAsInt);
    }, 1);
}

module.exports = {
  accessExpiry: parseValue(process.env.JWT_ACCESS_EXPIRY),
  emailVerificationExpiry: parseValue(process.env.JWT_EMAIL_VERIFICATION_EXPIRY),
  refreshExpiry: parseValue(process.env.JWT_REFRESH_EXPIRY)
};
