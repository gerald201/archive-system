const fs = require('fs');
const path = require('path');
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
          courseId: {
            type: 'number',
            integer: true,
            positive: true
          }
        }
      },
      file: {
        handle: 'single',
        destination: 'question-banks',
        schema: {
          file: {extensions: 'pdf'}
        }
      }
    }),
    async function(request, response, next) {
      try {
        const course = await models.Course.findByPk(request.body.courseId);
  
        if(!course) return next({name: 'ResourceNotFoundError'});
  
        const uploadsPath = path.join(__dirname, '../../../../storage/uploads');

        request.body.file = path.relative(uploadsPath, request.file.path);

        const questionBank = await models.QuestionBank.create(request.body);
  
        return response.respond({
          name: 'ResourceCreationSuccess',
          data: {questionBank: questionBank.toJSON()}
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
        const questionBank = await models.QuestionBank.findByPk(request.params.id);

        if(!questionBank) return next({name: 'ResourceNotFoundError'});

        await questionBank.destroy();
        await questionBank.reload();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          data: {questionBank: questionBank.toJSON()}
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
          databaseQuery.include = {
            model: models.Course,
            as: 'Course',
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
          };
        }

        if(orderQueryData) databaseQuery.order = orderQueryData;

        if(whereQueryData) databaseQuery.where = whereQueryData;

        if(limitQueryData) databaseQuery.limit = limitQueryData;

        if(offsetQueryData) databaseQuery.offset = offsetQueryData;

        const questionBanks = await models.QuestionBank.findAll(databaseQuery);
        
        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {questionBanks}
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
          courseId: {
            type: 'number',
            optional: true,
            integer: true,
            positive: true
          }
        }
      },
      file: {
        handle: 'single',
        destination: 'question-banks',
        schema: {
          file: {
            extensions: 'pdf',
            optional: true
          }
        }
      }
    }),
    async function(request, response, next) {
      try {
        const questionBank = await models.QuestionBank.findByPk(request.params.id);

        if(!questionBank) return next({name: 'ResourceNotFoundError'});

        if('courseId' in request.body) {
          const course = await models.Course.findByPk(request.body.courseId);

          if(!course) return next({name: 'ResourceNotFoundError'});
        }

        if(request.file) {
          const uploadsPath = path.join(__dirname, '../../../../storage/uploads');
          fs.rm(path.join(uploadsPath, questionBank.file));
          request.body.file = path.relative(uploadsPath, request.file.path);
        }

        await questionBank.update(request.body);
        await questionBank.reload();
        return response.respond({
          name: 'ResourceUpdateSuccess',
          data: {questionBank: questionBank.toJSON()}
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
    async function(request, response, next) {
      try {
        const questionBank = await models.QuestionBank.findByPk(request.params.id);

        if(!questionBank) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {questionBank: questionBank.toJSON()}
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
