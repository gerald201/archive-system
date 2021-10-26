const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Level extends Model {
    static associate(models) {
      this.hasMany(models.QuestionBank, {
        as: {
          plural: 'questionBanks',
          singular: 'questionBank'
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
