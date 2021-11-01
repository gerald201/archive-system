const models = require('../../../../database/models');
const { createHashAndSalt } = require('../../../../services/crypto');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');

function create() {
  return [
    roleGuard({allowed: 'super_administrator'}),
    validationGuard({
      body: {
        schema: {
          $$strict: 'remove',
          index: {
            type: 'string',
            empty: false
          },
          firstName: {
            type: 'string',
            empty: 'false',
            min: 3
          },
          lastName: {
            type: 'string',
            empty: 'false',
            min: 3
          }
        }
      }
    }),
    async function(request, response, next) {
      try {
        const existingStudent = await models.User.findOne({
          where: {index: request.body.index}
        });
  
        if(existingStudent) return next({name: 'ResourceUniqueViolationError'});
  
        const passwordHashAndSalt = createHashAndSalt(request.body.index);
        const student = await models.User.create({
          index: request.body.index,
          ...passwordHashAndSalt
        });
  
        await student.reload();
        await student.addRole(await models.Role.findOne({
          where: {name: 'student'}
        }));
        await student.createUserProfile({
          firstName: request.body.firstName,
          lastName: request.body.lastName,
          userProfileTypeId: (await models.UserProfileType.findOne({
            where: {name: 'student'}
          })).id
        });
  
        return response.respond({
          name: 'ResourceCreationSuccess',
          data: {student: await student.toDescriptiveJSON()}
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
    roleGuard({allowed: 'super_administrator'}),
    async function(request, response, next) {
      try {
        const studentProfiles = await models.UserProfile.findAll({
          where: {
            userProfileTypeId: (await models.UserProfileType.findOne({
              where: {name: 'student'}
            })).id
          }
        });
        const rawStudents = models.User.findAll({
          where: {
            ...request.parseWhereClause(request.query.where),
            id: {
              [models.Sequelize.Op.in]: studentProfiles
                .map(function(studentProfile) {
                  return studentProfile.id;
                })
            }
          }
        });
        const students = [];
        
        for(const rawStudent of rawStudents) {
          students.push(await rawStudent.toDescriptiveJSON());
        }

        return response.respond({
          name: 'ResourceRetrievalSuccess',
          data: {students}
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
  index
};
