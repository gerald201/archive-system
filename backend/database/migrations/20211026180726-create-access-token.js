async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('AccessTokens');
}

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('AccessTokens', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    expiresAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    revokedAt: {
      allowNull: true,
      type: Sequelize.DATE
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
