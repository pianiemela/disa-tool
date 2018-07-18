const validators = {
  logged_in: req => req.user !== null,
  teacher_on_course: req => req.body.course_instance_id !== undefined // placeholder
}

const getPrivileges = (req) => {
  if (!req.headers.privileges) {
    return []
  }
  const privileges = req.headers.privileges.split(',').filter(privilege => validators[privilege])
  const privilegeMap = {}
  privileges.filter(privilege => validators[privilege](req)).forEach((privilege) => {
    privilegeMap[privilege] = true
  })
  return privilegeMap
}

module.exports = (req, res, next) => {
  req.privileges = getPrivileges(req)
  next()
}
