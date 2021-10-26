const moment = require('moment');

const userProfileTypes = [
  {
    name: 'student',
    description: 'Studies at institution.'
  },
  {
    name: 'staff',
    description: 'Works at institution.'
  }
];

async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('UserProfileTypes', {[Sequelize.Op.or]: userProfileTypes}, {});
}

async function up(queryInterface, Sequelize) {
  const preppedUserProfileTypes = userProfileTypes
    .map(function(userProfileType) {
      return {
        ...userProfileType,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate(),
      }
    });

  await queryInterface.bulkInsert('UserProfileTypes', preppedUserProfileTypes, {});
}

module.exports = {
  down,
  up
};
