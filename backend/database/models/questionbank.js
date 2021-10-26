const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class QuestionBank extends Model {
    static associate(models) {
      this.belongsTo(models.Level, {
        as: 'level',
        foreignKey: 'levelId'
      });

      this.belongsTo(models.Program, {
        as: 'program',
        foreignKey: 'programId'
      });

      this.belongsTo(models.Semester, {
        as: 'semester',
        foreignKey: 'semesterId'
      });
    }
  }

  QuestionBank.init({
    file: DataTypes.STRING,
    levelId: DataTypes.INTEGER,
    programId: DataTypes.INTEGER,
    semisterId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'QuestionBank',
    paranoid: true
  });

  return QuestionBank;
}

module.exports = main;
