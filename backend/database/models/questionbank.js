const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class QuestionBank extends Model {
    static associate(models) {
      this.belongsTo(models.Program, {
        as: 'program',
        foreignKey: 'programId'
      });
    }
  }

  QuestionBank.init({
    level: DataTypes.ENUM('100', '200', '300', '400'),
    semister: DataTypes.ENUM('first', 'second'),
    file: DataTypes.STRING,
    programId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuestionBank',
    paranoid: true
  });

  return QuestionBank;
}

module.exports = main;
