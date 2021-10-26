async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('RoleUsers');
}

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('RoleUsers', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    roleId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    userId: {
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
