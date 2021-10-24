const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Role extends Model {
    static associate(models) {
      this.belongsToMany(models.User, {
        as: {
          plural: 'users',
          singular: 'user'
        },
        foreignKey: 'roleId',
        hooks: true,
        otherKey: 'userId',
        through: models.RoleUser
      })
    }
  }

  Role.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    paranoid: true,
    hooks: {
      async beforeDestroy(role) {
        await role.setUsers([]);
      }
    }
  });
  
  return Role;
}

module.exports = main;
