const serverConfiguration = require('../configuration/server');
const serverCore = require('../core/server');
const socketCore = require('../core/socket');
const { generateJWTKeys } = require('../services/jwt');

generateJWTKeys();
socketCore();
serverCore.listen(serverConfiguration.port, serverConfiguration.host, function() {
  console.log(`Server is live or port :: ${serverConfiguration.port}`);
});
