const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const databaseConfiguration = require('../../configuration/database');
const serverConfiguration = require('../../configuration/server');
const emitterService = require('../../services/emitter');

const connectionConfig = databaseConfiguration[serverConfiguration.env];
const connection = connectionConfig.use_env_variable ? new Sequelize(process.env[connectionConfig.use_env_variable], connectionConfig) : new Sequelize(connectionConfig.database, connectionConfig.username, connectionConfig.password, connectionConfig);

const models = fs
  .readdirSync(__dirname)
  .filter(function(fileName) {
    return fileName.indexOf('.') != 0 && fileName != path.basename(__filename) && fileName.slice(-3) == '.js';
  })
  .reduce(function(accumulator, fileName) {
    const model = require(path.join(__dirname, fileName))(connection, Sequelize.DataTypes);

    accumulator[model.name] = model;
    return accumulator;
  }, {});

for(const modelName in models) {
  models[modelName].associate?.(models);
}

module.exports = {
  ...models,
  connection,
  Sequelize
};