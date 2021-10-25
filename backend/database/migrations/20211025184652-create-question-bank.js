async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('QuestionBanks');
}

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('QuestionBanks', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    level: {
      allowNull: false,
      type: Sequelize.ENUM('100', '200', '300', '400')
    },
    semister: {
      allowNull: false,
      type: Sequelize.ENUM('first', 'second')
    },
    file: {
      allowNull: false,
      type: Sequelize.STRING
    },
    programId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deletedAt: {
      allowNull: true,
      type: Sequelize.DATE
    }
  });
}

module.exports = {
  down,
  up
};