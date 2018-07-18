const validators = {
  logged_in: req => req.user !== null,
  teacher_on_course: () => true // placeholder
}

const getPrivileges = (req) => {
  if (!req.query.privileges) {
    return []
  }
  const privileges = req.query.privileges.split(',').filter(privilege => validators[privilege])
  const privilegeMap = {}
  privileges.filter(privilege => validators[privilege](req)).forEach((privilege) => {
    privilegeMap[privilege] = true
  })
  console.log(privilegeMap)
  return privilegeMap
}

module.exports = (req, res, next) => {
  req.privileges = getPrivileges(req)
  next()
}
