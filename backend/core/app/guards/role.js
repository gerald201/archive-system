const models = require('../../../database/models');
const authenticationGuard = require('./authentication');

function main(options) {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const allRoles = (await models.Role.findAll({
          attributes: ['name']
        }))
          .map(function(role) {
            return role.name;
          });
        const include = (Array.isArray(options) ? options : (typeof options == 'string' ? [options] : (Array.isArray(options?.include) ? options.include : (typeof options?.include == 'string' ? [options.include] : []))))
          .filter(function(role) {
            return allRoles.includes(role);
          });
        const exclude = (Array.isArray(options?.exclude) ? options.exclude : (typeof options?.exclude == 'string' ? [options.exclude] : []))
          .filter(function(role) {
            return allRoles.includes(role) && !include.includes(role);
          });
        const includeCount = await request.user.countRoles({
          where: {
            name: {[models.Sequelize.Op.in]: include}
          }
        });
        const excludeCount = await request.user.countRoles({
          where: {
            name: {[models.Sequelize.Op.in]: exclude}
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
