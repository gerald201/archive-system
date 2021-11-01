const fs = require('fs');
const path = require('path');
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
    roleGuard({allowed: 'super_administrator'}),
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

        const questionBanks = await models.QuestionBank.findAll({
          attributes: attributesQueryData,
          order: orderQueryData,
          where: whereQueryData,
          ...paginationData
        });
        const preppedQuestionBanks = [];

        for(const questionBank of questionBanks) {
          preppedQuestionBanks.push(questionBank.toJSON());
        }
        
        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {questionBanks: preppedQuestionBanks}
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

        if(request.body.hasOwnProperty('levelId')) {
          const level = await models.Level.findByPk(request.body.levelId);

          if(!level) return next({name: 'ResourceNotFoundError'});
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
