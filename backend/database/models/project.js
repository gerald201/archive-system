const { Model } = require('sequelize');

function main(sequelize, DataTypes) {
  class Project extends Model {
    static associate(models) {
      this.belongsTo(models.Program, {
        as: 'program',
        foreignKey: 'programId'
      });

      this.belongsTo(models.User, {
        as: 'user',
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
