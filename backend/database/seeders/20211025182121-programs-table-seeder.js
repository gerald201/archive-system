const moment = require('moment');

const programs = [
  {
    name: 'bit',
    description: 'Bachelor of Science in Information Technology.'
  },
  {
    name: 'bce',
    description: 'Bachelor of Science in Computer Engineering.'
  },
  {
    name: 'bte',
    description: 'Bachelor of Science in Tele-communication Engineering.'
  }
];

async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Programs', {[Sequelize.Op.or]: programs}, {});
}

async function up(queryInterface, Sequelize) {
  const preppedPrograms = programs
    .map(function(program) {
      return {
        ...program,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
      }
    });

  await queryInterface.bulkInsert('Programs', preppedPrograms, {});
}

module.exports = {
  down,
  up
};
