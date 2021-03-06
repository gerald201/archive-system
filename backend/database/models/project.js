const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Project extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'User',
        foreignKey: 'userId'
      });
    }
  }

  Project.init({
    name: DataTypes.STRING,
    file: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Project',
    paranoid: true
  });

  return Project;
}

module.exports = main;
