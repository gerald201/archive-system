const moment = require('moment');
const { createHashAndSalt } = require('../../services/crypto');

const users = [
  {
    index: 'super_admin',
    password: 'suP3r4dm1N',
    Roles: ['super_administrator'],
    UserProfile: {
      firstName: 'Super',
      lastName: 'Admin'
    },
    UserProfileType: 'staff'
  }
];

async function down(queryInterface, Sequelize) {
  const userIds = [];

  for(const user of users) {
    const id = await queryInterface.rawSelect('Users', {
      where: {index: user.index}
    }, ['id']);

    if(typeof id == 'number') userIds.push(id);
  }

  await queryInterface.bulkDelete('RoleUsers', {
    userId: {[Sequelize.Op.in]: userIds}
  }, {});
  await queryInterface.bulkDelete('UserProfiles', {
    userId: {[Sequelize.Op.in]: userIds}
  }, {});
  await queryInterface.bulkDelete('Users', {
    id: {[Sequelize.Op.in]: userIds}
  }, {});
}

async function up(queryInterface, Sequelize) {
  const preppedUsers = users
    .map(function(user) {
      const hashAndSalt = createHashAndSalt(user.password);

      return {
        index: user.index,
        ...hashAndSalt,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate()
      };
    });

  await queryInterface.bulkInsert('Users', preppedUsers, {});

  for(const user of users) {
    const userId = await queryInterface.rawSelect('Users', {
      where: {index: user.index}
    }, ['id']);
    const userProfileTypeId = await queryInterface.rawSelect('UserProfileTypes', {
      where: {name: user.UserProfileType}
    }, ['id']);
    const roleIds = [];

    for(const role of user.Roles) {
      const id = await queryInterface.rawSelect('Roles', {
        where: {name: role}
      }, ['id']);

      if(typeof id == 'number') roleIds.push(id);
    }

    await queryInterface.bulkInsert('UserProfiles', [
      {
        ...user.UserProfile,
        userId,
        userProfileTypeId,
        createdAt: moment().toDate(),
        updatedAt: moment().toDate()
      }
    ], {});
    await queryInterface.bulkInsert('RoleUsers', roleIds
      .map(function(roleId) {
        return {
          roleId,
          userId,
          createdAt: moment().toDate(),
          updatedAt: moment().toDate()
        };
      }), {});
  }
}

module.exports = {
  down,
  up
};
