async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('Courses');
}

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('Courses', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true
    },
    description: {
      allowNull: true,
      type: Sequelize.STRING
    },
    levelId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    programId: {
      allowNull: false,
      type: Sequelize.INTEGER
    },
    semesterId: {
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
