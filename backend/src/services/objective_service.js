const { Objective, TaskObjective } = require('../database/models.js')

const prepareCreate = (data) => {
  const instance = Objective.build(data)
  return instance
}

const executeCreate = async (instance) => {
  await instance.save()
}

const getCreateValue = (instance, lang) => {
  const json = instance.toJSON()
  return {
    id: json.id,
    name: json[`${lang}_name`],
    category_id: json.category_id,
    skill_level_id: json.skill_level_id
  }
}

const prepareDelete = async (id) => {
  const instance = await Objective.findById(id, {
    include: {
      model: TaskObjective,
      attributes: ['task_id']
    }
  })
  return instance
}

const getDeleteValue = (instance) => {
  const json = instance.toJSON()
  return {
    id: json.id,
    category_id: json.category_id,
    skill_level_id: json.skill_level_id,
    task_ids: json.task_objectives.map(taskObjective => taskObjective.task_id)
  }
}

const executeDelete = (instance) => {
  instance.destroy()
}

module.exports = {
  prepareCreate,
  executeCreate,
  getCreateValue,
  prepareDelete,
  getDeleteValue,
  executeDelete
}
