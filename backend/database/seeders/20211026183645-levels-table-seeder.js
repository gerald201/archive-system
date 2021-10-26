const moment = require('moment');

const levels = [
  {
    name: '100',
    description: 'First Level.'
  },
  {
    name: '200',
    description: 'Second Level.'
  },
  {
    name: '300',
    description: 'Third Level.'
  },
  {
    name: '400',
    description: 'Final Level.'
  }
];

async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Levels', {[Sequelize.Op.or]: levels}, {});
}

async function up(queryInterface, Sequelize) {
  const preppedLevels = levels
    .map(function(level) {
      return {
        ...level,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
      }
    });

  await queryInterface.bulkInsert('Levels', preppedLevels, {});
}

module.exports = {
  down,
  up
};
