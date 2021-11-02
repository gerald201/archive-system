'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Semester extends Model {
    static associate(models) {
      this.hasMany(models.Course, {
        as: {
          plural: 'Courses',
          singular: 'Course'
        },
        foreignKey: 'semesterId'
      });
    }
  };
  Semester.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Semester',
  });
  return Semester;
};