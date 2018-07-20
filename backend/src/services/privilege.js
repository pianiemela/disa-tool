const { CoursePerson } = require('../database/models')

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

const validators = {
  logged_in: (param, user) => user !== null,
  teacher_on_course: validateTeacherOnCourse
}

const checkPrivilege = async (req, privileges) => {
  for (const privilege of privileges) {
    if (!await validators[privilege.key](privilege.param, req.user)) {
      return false
    }
  }
  return true
}

module.exports = {
  checkPrivilege
}