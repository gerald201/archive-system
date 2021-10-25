const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Program extends Model {
    static associate(models) {
      this.hasMany(models.QuestionBank, {
        as: {
          plural: 'questionBanks',
          singular: 'questionBank'
        },
        foreignKey: 'programId'
      });
    }
  }

  Program.init({
    name: DataTypes.STRING,
    alias: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Program',
    paranoid: true
  });

  return Program;
}

module.exports = main;
