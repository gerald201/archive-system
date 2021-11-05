const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Course extends Model {
    static associate(models) {
      this.belongsTo(models.Level, {
        as: 'Level',
        foreignKey: 'levelId'
      });

      this.belongsTo(models.Program, {
        as: 'Program',
        foreignKey: 'programId'
      });

      this.belongsTo(models.Semester, {
        as: 'Semester',
        foreignKey: 'semesterId'
      });
      
      this.hasMany(models.QuestionBank, {
        as: {
          plural: 'QuestionBanks',
          singular: 'QuestionBank'
        },
        foreignKey: 'courseId'
      });
    }
  }

  Course.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    levelId: DataTypes.INTEGER,
    ProgramId: DataTypes.INTEGER,
    semesterId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
    paranoid: true
  });

  return Course;
}

module.exports = main;
