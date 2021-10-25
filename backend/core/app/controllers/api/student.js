const models = require('../../../../database/models');
const { createHashAndSalt } = require('../../../../services/crypto');
const roleGuard = require('../../guards/role');
const validationGuard = require('../../guards/validation');

function create() {
  return [
    roleGuard({allowed: 'super_admin'}),
    validationGuard({
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
    }),
    async function(request, response, next) {
      try {
        const existingStudent = await models.User.findOne({
          where: {index: request.body.index}
        });
  
        if(existingStudent) return next({name: 'uniqueUserViolation'});
  
        const passwordHashAndSalt = createHashAndSalt(request.body.index);
  
        const student = await models.User.create({
          index: request.body.index,
          ...passwordHashAndSalt
        });
  
        await student.reload();
        await student.addRole(await models.Role.findOne({
          where: {name: 'student'}
        }));
        await student.createStudentData({
          firstName: request.body.firstName,
          lastName: request.body.lastName
        });
  
        const responseData = {
          title: 'Student Created Successfully.',
          message: 'A new student has been successfully created.',
          data: {
            student: await student.toAPIData()
          }
        };
  
        return response
          .status(201)
          .send(responseData);
      } catch(error) {
        return next({
          name: 'serverError',
          error
        });
      }
    }
  ];
}

function index() {
  return [
    roleGuard({allowed: 'super_admin'}),
    async function(request, response, next) {
      try {
        const studentDatas = await models.StudentData.findAll({
          attributes: ['userId']
        });
        const students = [];
        
        for(const studentData of studentDatas) {
          const student = await models.User.findByPk(studentData.userId);

          students.push(await student.toAPIData());
        }

        const responseData = {
          title: 'Students Retrieved Successfully.',
          message: 'All students have been successfully retrieved.',
          data: {students}
        };

        return response.send(responseData);
      } catch(error) {
        return next({
          name: 'serverError',
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
