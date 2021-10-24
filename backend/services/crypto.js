const crypto = require('crypto');

function checkWithHashAndSalt(string, hash, salt) {
  const check = crypto
    .pbkdf2Sync(string, salt, 10000, 64, 'sha512')
    .toString('hex');

  return hash == check;
}

function createHashAndSalt(string) {
  const salt = crypto
    .randomBytes(32)
    .toString('hex');
  const hash = crypto
    .pbkdf2Sync(string, salt, 10000, 64, 'sha512')
    .toString('hex');

  return {
    hash,
    salt
  };
}

module.exports = {
  checkWithHashAndSalt,
  createHashAndSalt
};
