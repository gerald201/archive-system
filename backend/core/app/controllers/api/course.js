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
          paranoid: false,
          where: {name: request.body.name}
        });

        if(existingCourse) return next({name: 'ResourceUniqueViolationError'});

        const level = await models.Level.findOne({
          paranoid: false,
          id: request.body.levelId
        });
        const program = await models.Program.findOne({
          paranoid: false,
          id: request.body.programId
        });
        const semester = await models.Semester.findOne({
          paranoid: false,
          id: request.body.semesterId
        });

        if(!(level && program && semester)) return next({name: 'ResourceNotFoundError'});

        const course = await models.Course.create(request.body, {
          include: [
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
          ]
        });

        await course.reload();
        return response.respond({
          name: 'ResourceCreationSuccess',
          payload: {course}
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
        const course = models.Course.findOne({
          include: [
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
          ],
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!course) return next({name: 'ResourceNotFoundError'});

        await course.destroy();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          payload: {course}
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

        const courses = await models.Course.findAll(databaseQuery);

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {courses}
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
        const course = models.Course.findOne({
          include: [
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
          ],
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!course) return next({name: 'ResourceNotFoundError'});

        await course.destroy({force: true});
        return response.respond({
          name: 'RescourceObliterationSuccess',
          payload: {course}
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
        const course = models.Course.findOne({
          include: [
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
          ],
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!course) return next({name: 'ResourceNotFoundError'});

        await course.restore();
        return response.respond({
          name: 'RescourceRestorationSuccess',
          payload: {course}
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
        const course = models.Course.findOne({
          include: [
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
          ],
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!course) return next({name: 'ResourceNotFoundError'});

        if('name' in request.body) {
          const existingCourse = await models.Course.findOne({
            paranoid: false,
            where: {name: request.body.name}
          });

          if(existingCourse && existingCourse.id != course.id) return next({name: 'ResourceUniqueViolationError'});
        }

        if('levelId' in request.body) {
          const level = await models.Level.findOne({
            paranoid: false,
            where: {id: request.body.levelId}
          });

          if(!level) return next({name: 'ResourceNotFoundError'});
        }

        if('programId' in request.body) {
          const program = await models.Program.findOne({
            paranoid: false,
            where: {id: request.body.programId}
          });

          if(!program) return next({name: 'ResourceNotFoundError'});
        }

        if('semesterId' in request.body) {
          const semester = await models.Semester.findOne({
            paranoid: false,
            where: {id: request.body.semesterId}
          });

          if(!semester) return next({name: 'ResourceNotFoundError'});
        }

        await course.update(request.body);
        return response.respond({
          name: 'ResourceUpdateSuccess',
          payload: {course}
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
        const course = models.Course.findOne({
          include: [
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
          ],
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!course) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'RescourceRetrievalSuccess',
          payload: {course}
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
