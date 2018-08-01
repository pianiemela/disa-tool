const { CoursePerson, Person } = require('../database/models')

const validatePerson = role => async (param, user) => {
  if (Number.isNaN(Number(param)) || !user) {
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
  return coursePerson.toJSON().role === role
}

const validateTeacher = async (param, user) => {
  if (!user) {
    return false
  }
  const person = await Person.findById(user.id, {
    attributes: ['role']
  })
  return person.toJSON().role === 'TEACHER'
}

const validators = {
  logged_in: (param, user) => user !== null,
  teacher_on_course: validatePerson('TEACHER'),
  student_on_course: validatePerson('STUDENT'),
  global_teacher: validateTeacher
}

/**
 * Returns a boolean representing whether or not the request has all the given privileges.
 * @param {*} req express request object
 * @param {*} privileges array of objects of the following shape
 * {
 *  key: string - required
 *  param: string or convertable to string - optional
 * }
 */
const checkPrivilege = async (req, privileges) => {
  const results = privileges.map(privilege => validators[privilege.key](privilege.param, req.user))
  return (await Promise.all(results)).every(value => value)
}

module.exports = {
  checkPrivilege
}