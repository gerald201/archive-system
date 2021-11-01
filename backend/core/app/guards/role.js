const models = require('../../../database/models');
const authenticationGuard = require('./authentication');

function main(options) {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const roleNames = await models.Role.findAll({
          attributes: ['name']
        });
        const allowedRoleNames = (Array.isArray(options?.allowed) ? options?.allowed : (typeof options.allowed == 'string' ? [options.allowed] : []))
          .filter(function(roleName) {
            return roleNames.includes(roleName);
          });
        const barredRoleNames = (Array.isArray(options?.barred) ? options.barred : (typeof options?.barred == 'string' ? [options.barred] : []))
          .filter(function(roleName) {
            return roleNames.includes(roleName) && !allowedRoleNames.includes(roleName);
          });
        const allowedCount = await request.user.countRoles({
          where: {
            name: {[models.Sequelize.Op.in]: allowedRoleNames}
          }
        });
        const barredCount = await request.user.countRoles({
          where: {
            name: {[models.Sequelize.Op.in]: barredRoleNames}
          }
        });
        const allowedCheck = allowedRoleNames.length ? allowedCount > 0 : true;
        const barredCheck = barredRoleNames.length ? barredCount == 0 : true;

        if(!(allowedCheck && barredCheck)) return next({name: 'PermissionSufficiencyError'});

        return next();
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

module.exports = main;
