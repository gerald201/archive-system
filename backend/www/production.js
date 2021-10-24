const serverConfig = require('../config/server');
const clusterCore = require('../core/cluster');
const serverCore = require('../core/server');
const { generateJWTKeys } = require('../services/jwt');

generateJWTKeys();

clusterCore(function() {
  serverCore.listen(serverConfig.port, function() {
    console.log(`Server is live or port :: ${serverConfig.port}`);
  });
});
