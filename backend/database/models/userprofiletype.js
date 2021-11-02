const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class UserProfileType extends Model {
    static associate(models) {
      this.hasMany(models.UserProfile, {
        as: {
          plural: 'UserProfiles',
          singular: 'UserProfile'
        },
        foreignKey: 'userProfileTypeId'
      });
    }
  }

  UserProfileType.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserProfileType',
    paranoid: true
  });

  return UserProfileType;
}

module.exports = main;
