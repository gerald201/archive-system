const moment = require('moment');

const roles = [
  {
    name: 'student',
    description: 'Studies at institution.'
  },
  {
    name: 'super_administrator',
    description: 'Administrator of all administrations.'
  }
];

async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Roles', {[Sequelize.Op.or]: roles}, {});
}

async function up(queryInterface, Sequelize) {
  const preppedRoles = roles
    .map(function(role) {
      return {
        ...role,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
      }
    });

  await queryInterface.bulkInsert('Roles', preppedRoles, {});
}

module.exports = {
  down,
  up
};
