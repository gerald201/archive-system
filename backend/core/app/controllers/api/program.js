const models = require('../../../../database/models');
const authenticationGuard = require('../../guards/authentication');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');

function create() {
  return [
    roleGuard('super_administrator'),
    validationGuard({
      body: {
        schema: {
          $$strict: 'remove',
          name: {
            type: 'string',
            empty: false
          },
          description: {
            type: 'string',
            empty: false,
            optional: true
          }
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

        await program.reload();
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
        const program = await models.Program.findOne({
          paranoid: false,
          where: {id: request.params.id}
        });

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
        const databaseQuery = {paranoid: false};

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(orderQueryData !== null) databaseQuery.order = orderQueryData;

        if(whereQueryData !== null) databaseQuery.where = whereQueryData;

        if(limitQueryData !== null) databaseQuery.limit = limitQueryData;

        if(offsetQueryData !== null) databaseQuery.offset = offsetQueryData;

        const programs = await models.Program.findAll(databaseQuery);

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {programs}
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

function obliterate() {
  return [
    roleGuard('super_administrator'),
    async function(request, response, next) {
      try {
        const program = await models.Program.findOne({
          paranoid: false,
          where: {id: request.params.id}
        });

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
        const program = await models.Program.findOne({
          paranoid: false,
          where: {id: request.params.id}
        });

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
          name: {
            type: 'string',
            empty: false,
            optional: true
          },
          description: {
            type: 'string',
            empty: false,
            optional: true
          }
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

        if('name' in request.body) {
          const existingProgram = await models.Program.findOne({
            paranoid: true,
            where: {name: request.body.name}
          });

          if(existingProgram && existingProgram.id != program.id) return next({name: 'ResourceUniqueViolationError'});
        }

        await program.update(request.body);
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
        const program = await models.Program.findOne({
          paranoid: false,
          where: {id: request.params.id}
        });

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
  create,
  destroy,
  index,
  obliterate,
  restore,
  update,
  view
};
