const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class QuestionBank extends Model {
    static associate(models) {
      this.belongsTo(models.Course, {
        as: 'Course',
        foreignKey: 'courseId'
      });
    }
  }

  QuestionBank.init({
    file: DataTypes.STRING,
    courseId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuestionBank',
    paranoid: true
  });

  return QuestionBank;
}

module.exports = main;
