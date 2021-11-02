const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Role extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        as: {
          plural: 'Users',
          singular: 'User'
        },
        foreignKey: 'roleId',
        otherKey: 'userId',
        through: models.RoleUser
      });
    }
  }

  Role.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    paranoid: true
  });
  
  return Role;
}

module.exports = main;
