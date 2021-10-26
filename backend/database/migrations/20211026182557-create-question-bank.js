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
    file: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    },
    levelId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    programId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    semisterId: {
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
