const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Program extends Model {
    static associate(models) {
      this.hasMany(models.Project, {
        as: {
          plural: 'projects',
          singular: 'project'
        },
        foreignKey: 'programId'
      });

      this.hasMany(models.Course, {
        as: {
          plural: 'courses',
          singular: 'course'
        },
        foreignKey: 'programId'
      });
    }
  }

  Program.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Program',
    paranoid: true
  });

  return Program;
}

module.exports = main;
