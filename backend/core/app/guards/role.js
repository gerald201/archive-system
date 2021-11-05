const models = require('../../../database/models');
const authenticationGuard = require('./authentication');

function main(options) {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        options = options?.constructor?.name?.toLowerCase() == 'object' ? options : (Array.isArray(options) ? {include: options} : (typeof options == 'string' ? {include: [options]} : {}));
        options.exclude = (Array.isArray(options?.exclude) ? options.exclude : (typeof options?.exclude == 'string' ? [options.exclude] : []));
        options.include = (Array.isArray(options?.include) ? options.include : (typeof options?.include == 'string' ? [options.include] : []));

        const roleNames = await models.Role.findAll({
          attributes: ['name']
        });
        const excludedRoleNames = options.exclude
          .filter(function(roleName) {
            return roleNames.includes(roleName) && !includedRoleNames.includes(roleName);
          });
        const includedRoleNames = options.include
          .filter(function(roleName) {
            return roleNames.includes(roleName);
          });
        const excludeCount = await request.user.countRoles({
          where: {
            name: {[models.Sequelize.Op.in]: excludedRoleNames}
          }
        });
        const includeCount = await request.user.countRoles({
          where: {
            name: {[models.Sequelize.Op.in]: includedRoleNames}
          }
        });
        const excludeCheck = excludedRoleNames.length ? excludeCount == 0 : true;
        const icludeCheck = includedRoleNames.length ? includeCount > 0 : true;

        if(!(icludeCheck && excludeCheck)) return next({name: 'PermissionSufficiencyError'});

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
