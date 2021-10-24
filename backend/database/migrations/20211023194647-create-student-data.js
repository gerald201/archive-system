async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('StudentData');
}

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('StudentData', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      type: Sequelize.STRING
    },
    lastName: {
      type: Sequelize.STRING
    },
    userId: {
      type: Sequelize.INTEGER
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}

module.exports = {
  down,
  up
};
