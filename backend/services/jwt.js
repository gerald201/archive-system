const crypto = require('crypto');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const path = require('path');
const jwtConfig = require('../config/jwt');
const models = require('../database/models');
const keyData = require('../resources/data/jwt-service-key-data');

async function checkJWTToken(type, string) {
  const typeCheck = Object
    .keys(keyData)
    .includes(type);

  if(!typeCheck) return null;

  try {
    const publicKey = await fs.promises.readFile(path.join(__dirname, `../keys/${keyData[type].file}-rsa-public.pem`));
    const payload = jwt.verify(string, publicKey, {
      algorithms: ['RS256'],
      ignoreExpiration: true
    });
    const token = await models[keyData[type].model].findOne({
      where: {
        id: payload?.sub,
        revokedAt: null
      }
    });

    if(!token) return null;

    if(moment().valueOf() >= moment(token.expiresAt).valueOf()) {
      await token.revoke();
      return null;
    }

    return token;
  } catch(error) {
    return null;
  }
}

async function createJWTToken(type, userId) {
  const typeCheck = Object
    .keys(keyData)
    .includes(type);

  if(!typeCheck) return null;

  try {
    const privateKey = await fs.promises.readFile(path.join(__dirname, `../keys/${keyData[type].file}-rsa-private.pem`));
    const user = await models.User.findByPk(userId);

    if(!user) return null;

    await user[keyData[type].revoke]();

    const token = await models[keyData[type].model].create({
      expiresAt: moment().format(),
      userId
    });

    await token.update({expiresAt: moment(token.createdAt).add(jwtConfig[keyData[type].expiry], 's').format()});
    await token.reload();

    const tokenString = jwt.sign({
      sub: token.id,
      iat: moment(token.createdAt).unix()
    }, privateKey, {
      expiresIn: jwtConfig[keyData[type].expiry],
      algorithm: 'RS256'
    });

    return {
      expiresIn: jwtConfig[keyData[type].expiry],
      token: tokenString
    }
  } catch(error) {
    return null;
  }
}

function generateJWTKeys(refresh) {
  const keyPath = path.join(__dirname, '../keys');
  const modulusLength = 4096;
  const encodeConfig = {
    type: 'pkcs1',
    format: 'pem'
  };

  Object
    .values(keyData)
    .map(function(data) {
      return data.file;
    })
    .forEach(function(key) {
      const privateKey = `${key}-rsa-private.pem`;
      const publicKey = `${key}-rsa-public.pem`;

      const keysExist = fs.existsSync(path.join(keyPath, privateKey)) && fs.existsSync(path.join(keyPath, publicKey));

      if(!refresh && keysExist) return;

      const keyPair = crypto.generateKeyPairSync('rsa', {
        modulusLength,
        privateKeyEncoding: encodeConfig,
        publicKeyEncoding: encodeConfig
      });

      fs.writeFileSync(path.join(keyPath, privateKey), keyPair.privateKey);
      fs.writeFileSync(path.join(keyPath, publicKey), keyPair.publicKey);
    });
}

module.exports = {
  checkJWTToken,
  createJWTToken,
  generateJWTKeys
};
