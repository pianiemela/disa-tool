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
  const { role } = person.toJSON()
  return role === 'TEACHER' || role === 'ADMIN'
}

const validateAdmin = async (param, user) => {
  if (!user) {
    return false
  }
  const person = await Person.findById(user.id, {
    attributes: ['role']
  })
  return person.toJSON().role === 'ADMIN'
}

const validators = {
  logged_in: (param, user) => user !== null,
  teacher_on_course: validatePerson('TEACHER'),
  student_on_course: validatePerson('STUDENT'),
  global_teacher: validateTeacher,
  admin: validateAdmin
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

const isTeacherOnCourse = async (req, res, courseId) => {
  if (!await checkPrivilege(req, [
    {
      key: 'teacher_on_course',
      param: courseId
    }
  ])) {
    res.status(403).json({
      error: 'you are not a teacher on this course'
    })
    return false
  }
  return true
}

module.exports = {
  checkPrivilege,
  isTeacherOnCourse
}
