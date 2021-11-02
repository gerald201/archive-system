const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Role, {
        as: {
          plural: 'Roles',
          singular: 'Role'
        },
        foreignKey: 'userId',
        otherKey: 'roleId',
        through: models.RoleUser
      });

      this.hasMany(models.AccessToken, {
        as: {
          plural: 'AccessTokens',
          singular: 'AccessToken'
        },
        foreignKey: 'userId'
      });

      this.hasMany(models.Project, {
        as: {
          plural: 'Project',
          singular: 'Projects'
        },
        foreignKey: 'userId'
      });

      this.hasMany(models.RefreshToken, {
        as: {
          plural: 'RefreshTokens',
          singular: 'RefreshToken'
        },
        foreignKey: 'userId'
      });

      this.hasOne(models.UserProfile, {
        as: 'UserProfile',
        foreignKey: 'userId'
      });
    }
  }

  User.init({
    index: DataTypes.STRING,
    hash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    paranoid: true
  });
  
  return User;
}

module.exports = main;
