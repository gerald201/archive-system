const models = require('../../../../database/models');
const authenticationGuard = require('../../guards/authentication');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');

function index() {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const orderQueryData = request.parseDatabaseQuery('order', request.query.order);
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const { limit: limitQueryData, offset: offsetQueryData } = request.parsePagination(request.query.pagination);
        const databaseQuery = {paranoid: false};

        if(attributesQueryData) databaseQuery.attributes = attributesQueryData;

        if(orderQueryData) databaseQuery.order = orderQueryData;

        if(whereQueryData) databaseQuery.where = whereQueryData;

        if(limitQueryData) databaseQuery.limit = limitQueryData;

        if(offsetQueryData) databaseQuery.offset = offsetQueryData;

        const userProfileTypes = await models.UserProfileType.findAll(databaseQuery);

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {userProfileTypes}
        });
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

function view() {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const userProfileType = await models.UserProfileType.findOne({
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!userProfileType) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'RescourceRetrievalSuccess',
          data: {userProfileType}
        });
      } catch(error) {
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

module.exports = {
  index,
  view
};
