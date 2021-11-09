const models = require('../../../../database/models');

function index() {
  return [
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const orderQueryData = request.parseDatabaseQuery('order', request.query.order);
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const { limit: limitQueryData, offset: offsetQueryData } = request.parsePagination(request.query.pagination);
        const databaseQuery = {paranoid: false};

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(orderQueryData !== null) databaseQuery.order = orderQueryData;

        if(whereQueryData !== null) databaseQuery.where = whereQueryData;

        if(limitQueryData !== null) databaseQuery.limit = limitQueryData;

        if(offsetQueryData !== null) databaseQuery.offset = offsetQueryData;

        const roles = await models.Role.findAll(databaseQuery);

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {roles}
        });
      } catch(error) {
        return  next({
          name: 'ServerError',
          error
        });
      }
    }
  ]
}

function view() {
  return [
    async function(request, response, next) {
      try {
        const role = await models.Role.findOne({
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!role) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {role}
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
