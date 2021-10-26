async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('UserProfiles');
}

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('UserProfiles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      allowNull: true,
      type: Sequelize.STRING
    },
    lastName: {
      allowNull: true,
      type: Sequelize.STRING
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    userProfileTypeId: {
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
