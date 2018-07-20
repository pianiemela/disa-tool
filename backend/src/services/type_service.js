const { Type, TaskType } = require('../database/models.js')

const prepareCreate = (data) => {
  const instance = Type.build(data)
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
    multiplier: json.multiplier
  }
}

const prepareDelete = async (id) => {
  const instance = await Type.findById(id, {
    include: {
      model: TaskType,
      attributes: ['task_id']
    }
  })
  return instance
}

const getDeleteValue = (instance) => {
  const json = instance.toJSON()
  const taskIds = json.task_types.map(taskType => taskType.task_id)
  return {
    id: Number(json.id),
    task_ids: taskIds
  }
}

const executeDelete = (instance) => {
  instance.destroy()
  return instance
}

module.exports = {
  prepareCreate,
  executeCreate,
  getCreateValue,
  prepareDelete,
  getDeleteValue,
  executeDelete
}
