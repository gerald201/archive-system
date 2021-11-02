const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class AccessToken extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'User',
        foreignKey: 'userId'
      });
    }
  } 

  AccessToken.init({
    expiresAt: DataTypes.DATE,
    revokedAt: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'AccessToken',
    paranoid: true
  });

  return AccessToken;
}

module.exports = main;
