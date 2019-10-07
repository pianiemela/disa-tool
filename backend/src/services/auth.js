const { Person } = require('../database/models.js')

/**
 * Todo: middleware
 */
const checkAuth = async (req) => {
  const { uid, schacpersonaluniquecode, displayname } = req.headers
  if (!uid) return null

  const studentnumber = schacpersonaluniquecode && schacpersonaluniquecode.length !== 0
    ? schacpersonaluniquecode.split(':')[6]
    : null

  try {
    const person = await Person.findOne({
      where: { username: uid },
      attributes: ['id', 'username', 'name', 'studentnumber', 'role']
    })

    if (!person) {
      const created = await Person.create({
        username: uid,
        studentnumber,
        name: displayname,
        role: 'STUDENT'
      })
      const loggedIn = {
        id: created.id,
        username: created.username,
        studentnumber: created.studentnumber,
        name: created.name,
        role: created.role
      }
      return loggedIn
    }
    return person.toJSON()
  } catch (e) {
    return null
  }
}

module.exports = {
  checkAuth
}
