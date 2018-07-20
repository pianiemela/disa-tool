const { Objective, TaskObjective } = require('../database/models.js')

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

const prepareDelete = async (id) => {
  const instance = await Objective.findById(id, {
    include: {
      model: TaskObjective,
      attributes: ['task_id']
    }
  })
  const value = instance.toJSON()
  return {
    instance,
    value: {
      id: value.id,
      category_id: value.category_id,
      skill_level_id: value.skill_level_id,
      task_ids: value.task_objectives.map(taskObjective => taskObjective.task_id)
    }
  }
}

module.exports = {
  create,
  prepareDelete
}
