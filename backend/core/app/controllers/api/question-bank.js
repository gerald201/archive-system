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
        const questionBankCount = await models.QuestionBank.count({paranoid: false});

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          payload: {questionBankCount}
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
        const course = await models.Course.findOne({
          paranoid: false,
          where: {id: request.body.courseId}
        });
  
        if(!course) return next({name: 'ResourceNotFoundError'});
  
        const uploadsPath = path.join(__dirname, '../../../../storage/uploads');

        request.body.file = path.relative(uploadsPath, request.file.path);

        const questionBank = await models.QuestionBank.create(request.body, {
          include: {
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
          }
        });
  
        await questionBank.reload();
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
        const questionBank = await models.QuestionBank.findOne({
          include: {
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
          },
          paranoid: false,
          where: {id: request.params.id}
        });

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
        const databaseQuery = {paranoid: false};

        if(attributesQueryData !== null) databaseQuery.attributes = attributesQueryData;

        if(includeQueryData !== null) databaseQuery.include = includeQueryData;
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
        const questionBank = await models.QuestionBank.findOne({
          include: {
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
          },
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!questionBank) return next({name: 'ResourceNotFoundError'});

        fs.rm(path.join(__dirname, '../../../../storage/uploads', questionBank.file), function(error) {});
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
        const questionBank = await models.QuestionBank.findOne({
          include: {
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
          },
          paranoid: false,
          where: {id: request.params.id}
        });

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
        const questionBank = await models.QuestionBank.findOne({
          include: {
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
          },
          paranoid: false,
          where: {id: request.params.id}
        });

        if(!questionBank) return next({name: 'ResourceNotFoundError'});

        if('courseId' in request.body) {
          const course = await models.Course.findOne({
            paranoid: false,
            where: {id: request.body.courseId}
          });

          if(!course) return next({name: 'ResourceNotFoundError'});
        }

        if(request.file) {
          const uploadsPath = path.join(__dirname, '../../../../storage/uploads');
          
          fs.rm(path.join(uploadsPath, questionBank.file), function(error) {});
          request.body.file = path.relative(uploadsPath, request.file.path);
        }

        await questionBank.update(request.body);
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
        const questionBank = await models.QuestionBank.findOne({
          include: {
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
          },
          paranoid: false,
          where: {id: request.params.id}
        });

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
