const { CoursePerson } = require('../database/models')

const validateTeacherOnCourse = async (param, user) => {
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
  return coursePerson.toJSON().role === 'TEACHER'
}

const validators = {
  logged_in: (param, user) => user !== null,
  teacher_on_course: validateTeacherOnCourse
}

const getPrivileges = (req) => {
  if (!req.query.privileges) {
    return []
  }
  const privileges = req.query.privileges.split(',').map((privilege) => {
    const [key, param] = privilege.split(':')
    return {
      key,
      param
    }
  }).filter(privilege => validators[privilege.key])
  const privilegeMap = {}
  privileges.filter(privilege => validators[privilege.key](privilege.param, req.user)).forEach((privilege) => {
    privilegeMap[`${privilege.key}:${privilege.param}`] = true
  })
  return privilegeMap
}

module.exports = (req, res, next) => {
  req.privileges = getPrivileges(req)
  next()
}
