const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Course extends Model {
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
      
      this.hasMany(models.QuestionBank, {
        as: {
          plural: 'questionBanks',
          singular: 'questionBank'
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
    SemesterId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Course',
    paranoid: true
  });

  return Course;
}

module.exports = main;