const models = require('../../../../database/models');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');

function create() {
  return [
    roleGuard({allowed: 'super_administrator'}),
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
          where: {name: request.body.name}
        });
  
        if(existingProgram) return next({name: 'ResourceUniqueViolationError'});
  
        const program = await models.Program.create(request.body);

        return response.respond({
          name: 'ResourceCreationSuccess',
          data: {program: program.toJSON()}
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
    roleGuard({allowed: 'super_administrator'}),
    async function(request, response, next) {
      try {
        const program = await models.Program.findByPk(request.params.id);

        if(!program) return next({name: 'ResourceNotFoundError'});

        await program.destroy();
        await program.reload();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          data: {program: program.toJSON()}
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
    roleGuard({
      allowed: [
        'super_administrator',
        'student'
      ]
    }),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDbQuery('attributes', request.query.attributes);
        const orderQueryData = request.parseDbQuery('order', request.query.order);
        const whereQueryData = request.parseDbQuery('where', request.query.where);
        const paginationData = request.parsePagination(request.query.pagination);

        const programs = await models.Program.findAll({
          attributes: attributesQueryData,
          order: orderQueryData,
          where: whereQueryData,
          ...paginationData
        });
        const preppedPrograms = [];

        for(const program of programs) {
          preppedPrograms.push(program.toJSON());
        }

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {programs: preppedPrograms}
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
    roleGuard({allowed: 'super_administrator'}),
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
        const program = await models.Program.findByPk(request.params.id);

        if(!program) return next({name: 'ResourceNotFoundError'});

        if(request.body.hasOwnProperty('name')) {
          const existingProgram = await models.Program.findOne({
            where: {name: request.body.name}
          });

          if(existingProgram) return next({name: 'ResourceUniqueViolationError'});
        }

        await program.update(request.body);
        await program.reload();
        return response.respond({
          name: 'ResourceUpdateSuccess',
          data: {program: program.toJSON()}
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
    roleGuard({
      allowed: [
        'super_administrator',
        'student'
      ]
    }),
    async function(request, response, next) {
      try {
        const program = await models.Program.findByPk(request.params.id);

        if(!program) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'RescourceRetrievalSuccess',
          data: {program: program.toJSON()}
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
  update,
  view
};
