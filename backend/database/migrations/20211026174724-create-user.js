async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Users');
}

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    index: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    },
    hash: {
      allowNull: false,
      type: Sequelize.STRING
    },
    salt: {
      allowNull: false,
      type: Sequelize.STRING
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
