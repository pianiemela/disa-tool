const { Objective } = require('../database/models.js')

const create = async (data) => {
  const value = await Objective.create(data)
  return value
}

module.exports = {
  create
}
