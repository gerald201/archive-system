const models = require('../../../../database/models');
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
          },
          levelId: {
            type: 'number',
            positive: true,
            integer: true
          },
          programId: {
            type: 'number',
            positive: true,
            integer: true
          },
          semesterId: {
            type: 'number',
            positive: true,
            integer: true
          }
        }
      }
    }),
    async function(request, response, next) {
      try {
        const existingCourse = await models.Course.findOne({
          where: {name: request.body.name}
        });

        if(existingCourse) return next({name: 'ResourceNotFoundError'});

        const level = await models.Level.findByPk(request.body.levelId);
        const program = await models.Program.findByPk(request.body.programId);
        const semester = await models.Semester.findByPk(request.body.semesterId);

        if(!(level && program && semester)) return next({name: 'ResourceNotFoundError'});

        const course = await models.Course.create(request.body);

        await course.reload();
        return response.respond({
          name: 'ResourceCreationSuccess',
          data: {course}
        })
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
        const course = models.Course.findByPk(request.params.id);

        if(!course) return next({name: 'ResourceNotFoundError'});

        await course.destroy();
        await course.reload();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          data: {course}
        })
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
    roleGuard([
      'super_administrator',
      'student'
    ]),
    async function(request, response, next) {
      try {
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const orderQueryData = request.parseDatabaseQuery('order', request.query.order);
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const { limit: limitQueryData, offset: offsetQueryData } = request.parsePagination(request.query.pagination);
        const databaseQuery = {};

        if(attributesQueryData) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData) databaseQuery.include = includeQueryData;
        else {
          databaseQuery.include = [
            {
              model: models.Level,
              as: 'Level'
            },
            {
              model: models.Program,
              as: 'Program'
            },
            {
              model: models.Semester,
              as: 'Semester'
            }
          ];
        }

        if(orderQueryData) databaseQuery.order = orderQueryData;

        if(whereQueryData) databaseQuery.where = whereQueryData;

        if(limitQueryData) databaseQuery.limit = limitQueryData;

        if(offsetQueryData) databaseQuery.offset = offsetQueryData;

        const courses = await models.Course.findAll(databaseQuery);

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {courses}
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
          },
          levelId: {
            type: 'number',
            positive: true,
            integer: true,
            optional: true
          },
          programId: {
            type: 'number',
            positive: true,
            integer: true,
            optional: true
          },
          semesterId: {
            type: 'number',
            positive: true,
            integer: true,
            optional: true
          }
        }
      }
    }),
    async function(request, response, next) {
      try {
        const course = await models.Course.findByPk(request.params.id);

        if(!course) return next({name: 'ResourceNotFoundError'});

        if('name' in request.body) {
          const existingCourse = await models.Course.findOne({
            where: {name: request.body.name}
          });

          if(existingCourse) return next({name: 'ResourceUniqueViolationError'});
        }

        if('levelId' in request.body) {
          const level = await models.Level.findByPk(request.body.levelId);

          if(!level) return next({name: 'ResourceNotFoundError'});
        }

        if('programId' in request.body) {
          const program = await models.Program.findByPk(request.body.programId);

          if(!program) return next({name: 'ResourceNotFoundError'});
        }

        if('semesterId' in request.body) {
          const semester = await models.Semester.findByPk(request.body.semesterId);

          if(!semester) return next({name: 'ResourceNotFoundError'});
        }

        await course.update(request.body);
        await course.reload();
        return response.respond({
          name: 'ResourceUpdateSuccess',
          data: {course: course.toJSON()}
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
    roleGuard([
      'super_administrator',
      'student'
    ]),
    async function(request, response, next) {
      try {
        const course = await models.Course.findByPk(request.params.id);

        if(!course) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'RescourceRetrievalSuccess',
          data: {course: course.toJSON()}
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
