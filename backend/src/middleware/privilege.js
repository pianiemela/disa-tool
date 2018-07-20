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

const getPrivileges = async (req) => {
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
  for (const privilege of privileges) {
    privilegeMap[`${privilege.key}:${privilege.param}`] = await validators[privilege.key](privilege.param, req.user)
    // This is the only way I could get it to work.
    // As far as I'm aware, eslint is demanding the impossible.
  }
  console.log(privilegeMap)
  return privilegeMap
}

module.exports = async (req, res, next) => {
  req.privileges = await getPrivileges(req)
  next()
}
