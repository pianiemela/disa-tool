const { CoursePerson } = require('../database/models')

/**
 * Returns a boolean representing whether or not all privileges have been granted to the request.
 * @param {*} req express request object
 * @param {*} privileges array of objects of the following shape
 * {
 *  key: string - required
 *  param: string or convertable to string - optional
 * }
 */
const checkPrivilege = (req, privileges) => privileges.every(privilege => req.privileges[privilegeCode(privilege)])

const privilegeCode = privilege => `${privilege.key}:${privilege.param}`

const validateTeacherOnCourse = async (param, user) => {
  if (Number.isNaN(Number(param))) {
    return false
  }
  const coursePerson = await CoursePerson.findOne({
    attributes: ['role'],
    where: {
      course_instance_id: Number(param),
      person_id: user.id
    }
  })
  if (!coursePerson) {
    return false
  }
  return coursePerson.toJSON().role === 'Teacher'
}

module.exports = {
  checkPrivilege,
  validateTeacherOnCourse
}