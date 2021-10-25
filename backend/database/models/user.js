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

      this.hasOne(models.StudentData, {
        as: 'studentData',
        foreignKey: 'userId'
      });
    }

    async revokeAllAccessTokens() {
      const tokens = await this.getAccessTokens();

      for(const token of tokens) {
        await token.revoke();
      }
    }

    async revokeAllRefreshTokens() {
      const tokens = await this.getRefreshTokens();

      for(const token of tokens) {
        await token.revoke();
      }
    }

    async toAPIData() {
      const hidden = [
        'hash',
        'salt'
      ];
      const data = this.toJSON();

      for(const key in this.toJSON()) {
        if(hidden.includes(key)) delete data[key];
      }

      const studentData = await this.getStudentData();

      if(studentData) data.StudentData = studentData;

      const roles = await this.getRoles();

      if(roles.length) data.Roles = roles;
      
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
