const models = require('../../../../database/models');
const authenticationGuard = require('../../guards/authentication');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');

function count() {
  return [
    authenticationGuard(),
    async function(request, response, next) {
      try {
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;
        
        if(whereQueryData !== null) databaseQuery.where = whereQueryData;

        const count = await models.Course.count(databaseQuery);

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
          description: 'string|empty:false|optional',
          levelId: 'number|integer|positive|convert',
          programId: 'number|integer|positive|convert',
          semesterId: 'number|integer|positive|convert'
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

        const course = await models.Course.create(request.body);
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        await course.reload(databaseQuery);
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
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        databaseQuery.where = {id: request.params.id};

        const course = models.Course.findOne(databaseQuery);

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
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const orderQueryData = request.parseDatabaseQuery('order', request.query.order);
        const whereQueryData = request.parseDatabaseQuery('where', request.query.where);
        const { limit: limitQueryData, offset: offsetQueryData } = request.parsePagination(request.query.pagination);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        if(orderQueryData !== null) databaseQuery.order = orderQueryData;

        if(whereQueryData !== null) databaseQuery.where = whereQueryData;

        if(limitQueryData !== null) databaseQuery.limit = limitQueryData;

        if(offsetQueryData !== null) databaseQuery.offset = offsetQueryData;

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
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        databaseQuery.where = {id: request.params.id};

        const course = await models.Course.findOne(databaseQuery);

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
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        databaseQuery.where = {id: request.params.id};

        const course = await models.Course.findOne(databaseQuery);

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
          name: 'string|empty:false|optional',
          description: 'string|empty:false|optional',
          levelId: 'number|integer|positive|convert|optional',
          programId: 'number|integer|positive|convert|optional',
          semesterId: 'number|integer|positive|convert|optional'
        }
      }
    }),
    async function(request, response, next) {
      try {
        const course = models.Course.findOne({
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!course) return next({name: 'ResourceNotFoundError'});

        const courseData = {};

        if(request.body.name) {
          const existingCourse = await models.Course.findOne({
            paranoid: false,
            where: {name: request.body.name}
          });

          if(existingCourse && existingCourse.id != course.id) return next({name: 'ResourceUniqueViolationError'});

          courseData.name = request.body.name;
        }

        if(request.body.levelId) {
          const level = await models.Level.findOne({
            paranoid: false,
            where: {id: request.body.levelId}
          });

          if(level) courseData.levelId = request.body.levelId;
        }

        if(request.body.programId) {
          const program = await models.Program.findOne({
            paranoid: false,
            where: {id: request.body.programId}
          });

          if(!program) courseData.programId = request.body.programId;
        }

        if(request.body.semesterId) {
          const semester = await models.Semester.findOne({
            paranoid: false,
            where: {id: request.body.semesterId}
          });

          if(!semester) courseData.semesterId = request.body.semesterId;
        }

        await course.update(courseData);

        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        await course.reload(databaseQuery);
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
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;

        databaseQuery.where = {id: request.params.id};

        const course = await models.Course.findOne(databaseQuery);

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
  count,
  create,
  destroy,
  index,
  obliterate,
  restore,
  update,
  view
};
