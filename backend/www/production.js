const serverConfiguration = require('../configuration/server');
const clusterCore = require('../core/cluster');
const serverCore = require('../core/server');
const { generateJWTKeys } = require('../services/jwt');

generateJWTKeys();

clusterCore(function() {
  serverCore.listen(serverConfiguration.port, function() {
    console.log(`Server is live or port :: ${serverConfiguration.port}`);
  });
});
