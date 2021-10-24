const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class StudentData extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId'
      });
    }
  }

  StudentData.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'StudentData',
  });
  
  return StudentData;
}

module.exports = main;
