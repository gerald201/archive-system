const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class RoleUser extends Model {
    static associate(models) {}
  }

  RoleUser.init({
    roleId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'RoleUser',
    paranoid: true
  });

  return RoleUser;
}

module.exports = main;
