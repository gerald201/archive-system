const dotenv = require('dotenv');
const valueMap = require('../resources/data/jwt-config-value-map');

dotenv.config();

function extractValue(string) {
  if(typeof string?.valueOf() != 'string') return 0;

  return /^(\d+)(\w)$/
    .exec(string)
    .filter(function(match, index) {
      return index > 0;
    })
    .reduce(function(accumulator, match) {
      return accumulator * (isNaN(match) || !match ? (valueMap[match] || 0) : parseInt(match));
    }, 1);
}

module.exports = {
  accessExpiry: extractValue(process.env.JWT_ACCESS_EXPIRY),
  emailVerificationExpiry: extractValue(process.env.JWT_EMAIL_VERIFICATION_EXPIRY),
  refreshExpiry: extractValue(process.env.JWT_REFRESH_EXPIRY)
};
