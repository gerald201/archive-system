const moment = require('moment');

const semesters = [
  {
    name: 'first',
    description: 'First Semester.'
  },
  {
    name: 'second',
    description: 'Last Semester.'
  }
];

async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Semesters', {[Sequelize.Op.or]: semesters}, {});
}

async function up(queryInterface, Sequelize) {
  const preppedSemesters = semesters
    .map(function(semester) {
      return {
        ...semester,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
      }
    });

  await queryInterface.bulkInsert('Semesters', preppedSemesters, {});
}

module.exports = {
  down,
  up
};
