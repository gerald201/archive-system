const {  Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class ActivityLog extends Model {
    static associate(models) {}
  }

  ActivityLog.init({
    type: DataTypes.ENUM('database', 'route'),
    data: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'ActivityLog',
    paranoid: true
  });

  return ActivityLog;
};

module.exports = main;
