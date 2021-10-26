async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('ActivityLogs');
} 

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('ActivityLogs', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    type: {
      allowNull: false,
      type: Sequelize.ENUM('database', 'route')
    },
    data: {
      allowNull: false,
      type: Sequelize.JSON
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deleteAt: {
      allowNull: true,
      type: Sequelize.DATE
    }
  });
}

module.exports = {
  down,
  up
};
