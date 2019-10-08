const { Person } = require('../database/models.js')

const getCurrentUser = async ({ username, studentnumber, name }) => {
  let person = null
  if (!person && username) {
    person = await Person.findOne({ where: {username} })
  }
  if (!person && studentnumber) {
    person = await Person.findOne({ where: {studentnumber} })
  }
  if (!person) {
    person = await Person.create({
      username,
      studentnumber,
      name,
      role: 'STUDENT'
    })
  }
  person.update({
    username: username || person.username,
    studentnumber: studentnumber || person.studentnumber,
    name: name || person.name
  })
  return person
}

const checkAuth = async (req) => {
  const { uid, schacpersonaluniquecode, displayname } = req.headers
  const studentnumber = schacpersonaluniquecode && schacpersonaluniquecode.length !== 0
    ? schacpersonaluniquecode.split(':')[6]
    : null

  try {
    const person = await getCurrentUser({ username: uid, studentnumber, name: displayname })
    return person.toJSON()
  } catch (e) {
    console.log(e)
    return null
  }
}

module.exports = {
  checkAuth
}
