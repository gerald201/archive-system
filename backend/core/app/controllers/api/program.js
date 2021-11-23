const models = require('../../../../database/models');
const authenticationGuard = require('../../guards/authentication');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');
const util = require('util');

function count() {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };
        
        if(whereQueryData !== null) databaseQuery.where = whereQueryData;

        const count = await models.Program.count(databaseQuery);

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {count}
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

function create() {
  return [
    roleGuard('super_administrator'),
    validationGuard({
      body: {
        schema: {
          $$strict: 'remove',
          name: 'string|empty:false',
          description: 'string|empty:false|optional'
        }
      }
    }),
    async function(request, response, next) {
      try {
        const existingProgram = await models.Program.findOne({
          paranoid: false,
          where: {name: request.body.name}
        });
  
        if(existingProgram) return next({name: 'ResourceUniqueViolationError'});
  
        const program = await models.Program.create(request.body);
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        await program.reload(databaseQuery);
        return response.respond({
          name: 'ResourceCreationSuccess',
          payload: {program}
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

function destroy() {
  return [
    roleGuard('super_administrator'),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        databaseQuery.where = {id: request.params.id};

        const program = await models.Program.findOne(databaseQuery);

        if(!program) return next({name: 'ResourceNotFoundError'});

        await program.destroy();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          payload: {program}
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

function index() {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const orderQueryData = request.parseDatabaseQuery('order', request.query.order);
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const { limit: limitQueryData, offset: offsetQueryData } = request.parsePagination(request.query.pagination);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(orderQueryData !== null) databaseQuery.order = orderQueryData;

        if(whereQueryData !== null) databaseQuery.where = whereQueryData;

        if(limitQueryData !== null) databaseQuery.limit = limitQueryData;

        if(offsetQueryData !== null) databaseQuery.offset = offsetQueryData;

        console.log('WHERE_QUERY_DATA', util.inspect(whereQueryData, false, 99, true));

        const programs = await models.Program.findAll(databaseQuery);

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {programs}
        });
      } catch(error) {
        console.log(error);
        return next({
          name: 'ServerError',
          error
        });
      }
    }
  ];
}

function obliterate() {
  return [
    roleGuard('super_administrator'),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        databaseQuery.where = {id: request.params.id};

        const program = await models.Program.findOne(databaseQuery);

        if(!program) return next({name: 'ResourceUniqueViolationError'});

        await program.destroy({force: true});
        return response.respond({
          name: 'ResourceObliterationSuccess',
          payload: {program}
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

function restore() {
  return [
    roleGuard('super_administrator'),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        databaseQuery.where = {id: request.params.id};

        const program = await models.Program.findOne(databaseQuery);

        if(!program) return next({name: 'ResourceUniqueViolationError'});

        await program.restore();
        return response.respond({
          name: 'ResourceRestorationSuccess',
          payload: {program}
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

function update() {
  return [
    roleGuard('super_administrator'),
    validationGuard({
      body: {
        schema: {
          $$strict: 'remove',
          name: 'string|empty:false|optional',
          description: 'string|empty:false|optional'
        }
      }
    }),
    async function(request, response, next) {
      try {
        const program = await models.Program.findOne({
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!program) return next({name: 'ResourceNotFoundError'});

        const programData = {};

        if(request.body.name) {
          const existingProgram = await models.Program.findOne({
            paranoid: true,
            where: {name: request.body.name}
          });

          if(!existingProgram) programData.name = request.body.name;
        }

        if(request.body.description) programData.description = request.body.description;

        await program.update(programData);

        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        await program.reload(databaseQuery);
        return response.respond({
          name: 'ResourceUpdateSuccess',
          payload: {program}
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
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        databaseQuery.where = {id: request.params.id};

        const program = await models.Program.findOne(databaseQuery);

        if(!program) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'RescourceRetrievalSuccess',
          payload: {program}
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
  count,
  create,
  destroy,
  index,
  obliterate,
  restore,
  update,
  view
};
