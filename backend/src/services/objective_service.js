const { Objective } = require('../database/models.js')

const create = async (data) => {
  const value = await Objective.create(data)
  return value
}

const deleteObjective = async (id) => {
  const value = await Objective.destroy({
    where: {
      id
    }
  })
  return value
}

module.exports = {
  create,
  delete: deleteObjective
}
