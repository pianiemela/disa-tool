const { Person } = require('../database/models.js')

const getUser = userId => Person.find({ where: { id: userId } })

module.exports = {
  getUser
}
