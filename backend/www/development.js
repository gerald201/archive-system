const serverConfig = require('../config/server');
const serverCore = require('../core/server');
const { generateJWTKeys } = require('../services/jwt');

generateJWTKeys();

serverCore.listen(serverConfig.port, serverConfig.host, function() {
  console.log(`Server is live or port :: ${serverConfig.port}`);
});
