const fs = require('fs');
const path = require('path');
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

        const count = await models.QuestionBank.count(databaseQuery);

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
          courseId: 'number|integer|positive|convert'
        }
      },
      file: {
        handler: 'single',
        destination: 'question-banks',
        schema: {
          file: {extensions: 'pdf'}
        }
      }
    }),
    async function(request, response, next) {
      try {
        const course = await models.Course.findOne({
          paranoid: false,
          where: {id: request.body.courseId}
        });
  
        if(!course) return next({name: 'ResourceNotFoundError'});
  
        const uploadsPath = path.join(__dirname, '../../../../storage/uploads');

        request.body.file = path.relative(uploadsPath, request.file.path);

        const questionBank = await models.QuestionBank.create(request.body);
        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;
  
        await questionBank.reload(databaseQuery);
        return response.respond({
          name: 'ResourceCreationSuccess',
          payload: {questionBank}
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

        const questionBank = await models.QuestionBank.findOne(databaseQuery);

        if(!questionBank) return next({name: 'ResourceNotFoundError'});

        await questionBank.destroy();
        return response.respond({
          name: 'ResourceDestructionSuccess',
          payload: {questionBank}
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

        const questionBanks = await models.QuestionBank.findAll(databaseQuery);
        
        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {questionBanks}
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

        const questionBank = await models.QuestionBank.findOne(databaseQuery);

        if(!questionBank) return next({name: 'ResourceNotFoundError'});

        fs.unlink(path.join(__dirname, '../../../../storage/uploads', questionBank.file), function(error) {});
        await questionBank.destroy({force: true});
        return response.respond({
          name: 'ResourceObliterationSuccess',
          payload: {questionBank}
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

        const questionBank = await models.QuestionBank.findOne(databaseQuery);

        if(!questionBank) return next({name: 'ResourceNotFoundError'});

        await questionBank.restore();
        return response.respond({
          name: 'ResourceRestorationSuccess',
          payload: {questionBank}
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
          courseId: 'number|integer|positive|convert|optional'
        }
      },
      file: {
        handler: 'single',
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
        const questionBank = await models.QuestionBank.findOne({
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!questionBank) return next({name: 'ResourceNotFoundError'});

        const questionBankData = {};

        if(request.body.courseId) {
          const course = await models.Course.findOne({
            paranoid: false,
            where: {id: request.body.courseId}
          });

          if(course) questionBankData.courseId = request.body.courseId;
        }

        if(request.file) {
          const uploadsPath = path.join(__dirname, '../../../../storage/uploads');
          
          fs.unlink(path.join(uploadsPath, questionBank.file), function(error) {});
          questionBankData.file = path.relative(uploadsPath, request.file.path);
        }

        await questionBank.update(questionBankData);

        const attributesQueryData = request.parseDatabaseQuery('attributes', request.query.attributes);
        const includeQueryData = request.parseDatabaseQuery('include', request.query.include);
        const databaseQuery = {
          paranoid: false,
          subQuery: false
        };

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;
  
        await questionBank.reload(databaseQuery);
        return response.respond({
          name: 'ResourceUpdateSuccess',
          payload: {questionBank}
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

        const questionBank = await models.QuestionBank.findOne(databaseQuery);

        if(!questionBank) return next({name: 'ResourceNotFoundError'});

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {questionBank}
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
