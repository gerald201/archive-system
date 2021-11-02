const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class RefreshToken extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'User',
        foreignKey: 'userId'
      });
    }
  }

  RefreshToken.init({
    expiresAt: DataTypes.DATE,
    revokedAt: DataTypes.DATE,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RefreshToken',
    paranoid: true
  });

  return RefreshToken;
}

module.exports = main;
