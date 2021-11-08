const serverConfiguration = require('../configuration/server');
const clusterCore = require('../core/cluster');
const serverCore = require('../core/server');
const socketCore = require('../core/socket');
const { generateJWTKeys } = require('../services/jwt');

generateJWTKeys();
socketCore();
clusterCore(function() {
  serverCore.listen(serverConfiguration.port, function() {
    console.log(`Server is live or port :: ${serverConfiguration.port}`);
  });
});
