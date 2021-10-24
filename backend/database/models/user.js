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
        hooks: true,
        otherKey: 'roleId',
        through: models.RoleUser
      });

      this.hasMany(models.AccessToken, {
        as: {
          plural: 'accessTokens',
          singular: 'accessToken'
        },
        foreignKey: 'userId',
        hooks: true,
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      this.hasMany(models.RefreshToken, {
        as: {
          plural: 'refreshTokens',
          singular: 'refreshToken'
        },
        foreignKey: 'userId',
        hooks: true,
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });

      this.hasOne(models.StudentData, {
        as: 'studentData',
        foreignKey: 'userId'
      });
    }

    async destroyAllAccessTokens() {
      const tokens = await this.getAccessTokens();

      for(const token of tokens) {
        await token.destroy();
      }
    }

    async destroyAllRefreshTokens() {
      const tokens = await this.getRefreshTokens();

      for(const token of tokens) {
        await token.destroy();
      }
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
    paranoid: true,
    hooks: {
      async beforeDestroy(user) {
        await user.destroyAllAccessTokens();
        await user.destroyAllRefreshTokens();

        await user.setRoles([]);
      }
    }
  });
  
  return User;
}

module.exports = main;
