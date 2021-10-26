const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class User extends Model {
    static associate(models) {
      this.belongsToMany(models.Role, {
        as: {
          plural: 'roles',
          singular: 'role'
        },
        foreignKey: 'userId',
        otherKey: 'roleId',
        through: models.RoleUser
      });

      this.hasMany(models.AccessToken, {
        as: {
          plural: 'accessTokens',
          singular: 'accessToken'
        },
        foreignKey: 'userId'
      });

      this.hasMany(models.Project, {
        as: {
          plural: 'project',
          singular: 'projects'
        },
        foreignKey: 'userId'
      });

      this.hasMany(models.RefreshToken, {
        as: {
          plural: 'refreshTokens',
          singular: 'refreshToken'
        },
        foreignKey: 'userId'
      });

      this.hasOne(models.UserProfile, {
        as: 'userProfile',
        foreignKey: 'userId'
      });
    }

    async toDescriptiveJSON() {
      const data = this.toJSON();
      const ignored = [
        'hash',
        'salt'
      ];
      const userProfile = await this.getUserProfile();
      const roles = await this.getRoles();

      for(const key of ignored) {
        delete data[key];
      }

      if(userProfile) {
        const userProfileType = await userProfile.getUserProfileType();

        data.UserProfile = userProfile.toJSON();
        data.UserProfile.UserProfileType = userProfileType.toJSON();
      }

      if(roles.length) {
        data.Roles = roles
          .map(function(role) {
            return role.toJSON();
          });
      }

      return data;
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
