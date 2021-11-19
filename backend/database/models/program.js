const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Program extends Model {
    static associate(models) {
      this.hasMany(models.Course, {
        as: {
          plural: 'Courses',
          singular: 'Course'
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
