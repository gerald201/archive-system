const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class UserProfile extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'User',
        foreignKey: 'userId'
      });

      this.belongsTo(models.UserProfileType, {
        as: 'UserProfileType',
        foreignKey: 'userProfileTypeId'
      });
    }
  }

  UserProfile.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    userProfileTypeId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'UserProfile',
    paranoid: true
  });
  
  return UserProfile;
}

module.exports = main;
