'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Semester extends Model {
    static associate(models) {
      this.hasMany(models.Course, {
        as: {
          plural: 'courses',
          singular: 'course'
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