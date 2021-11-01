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

        return response.respond({
          name: 'ResourceCreationSuccess',
          data: {course: course.toJSON()}
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
    roleGuard({allowed: 'super_administrator'}),
    async function(request, response, next) {
      try {
        const course = models.Course.findByPk(request.params.id);

        if(!course) return next({name: 'ResourceNotFoundError'});

        await course.destroy();
        await course.reload();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          data: {course: course.toJSON()}
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

        const courses = await models.Course.findAll({
          attributes: attributesQueryData,
          order: orderQueryData,
          where: whereQueryData,
          ...paginationData
        });
        const preppedCourses = [];

        for(const course of courses) {
          preppedCourses.push(course.toJSON());
        }

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {courses: preppedCourses}
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

        if(request.body.hasOwnProperty('name')) {
          const existingCourse = await models.Course.findOne({
            where: {name: request.body.name}
          });

          if(existingCourse) return next({name: 'ResourceUniqueViolationError'});
        }

        if(request.body.hasOwnProperty('levelId')) {
          const level = await models.Level.findByPk(request.body.levelId);

          if(!level) return next({name: 'ResourceNotFoundError'});
        }

        if(request.body.hasOwnProperty('programId')) {
          const program = await models.Program.findByPk(request.body.programId);

          if(!program) return next({name: 'ResourceNotFoundError'});
        }

        if(request.body.hasOwnProperty('semesterId')) {
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
    roleGuard({
      allowed: [
        'super_administrator',
        'student'
      ]
    }),
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
