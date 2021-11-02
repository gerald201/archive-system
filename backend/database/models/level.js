const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Level extends Model {
    static associate(models) {
      this.hasMany(models.Course, {
        as: {
          plural: 'Courses',
          singular: 'Course'
        },
        foreignKey: 'levelId'
      });
    }
  }

  Level.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Level',
    paranoid: true
  });

  return Level;
}

module.exports = main;
