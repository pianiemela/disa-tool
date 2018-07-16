const { Objective } = require('../database/models.js')

const create = async (data, lang) => {
  const value = (await Objective.create(data)).toJSON()
  const name = value[`${lang}_name`]
  return {
    id: value.id,
    name,
    category_id: value.category_id,
    skill_level_id: value.skill_level_id
  }
}

const deleteObjective = async (id) => {
  const instance = await Objective.findById(id)
  const value = instance.toJSON()
  instance.destroy()
  Objective.destroy({
    where: {
      id
    }
  })
  return {
    id: value.id,
    category_id: value.category_id,
    skill_level_id: value.skill_level_id
  }
}

module.exports = {
  create,
  delete: deleteObjective
}
