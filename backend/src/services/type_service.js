const { Type, TypeHeader, TaskType } = require('../database/models.js')

const create = {
  prepare: async (data) => {
    const instance = Type.build({
      eng_name: data.eng_name,
      fin_name: data.fin_name,
      swe_name: data.swe_name,
      type_header_id: data.type_header_id,
      multiplier: data.multiplier
    })
    const header = await TypeHeader.findById(data.type_header_id)
    return {
      instance,
      header: header.toJSON()
    }
  },
  execute: instance => instance.save(),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
      type_header_id: json.type_header_id,
      multiplier: json.multiplier
    }
  }
}

const deleteType = {
  prepare: id => Type.findById(id, {
    include: {
      model: TaskType,
      attributes: ['task_id']
    }
  }),
  value: (instance) => {
    const json = instance.toJSON()
    const taskIds = json.task_types.map(taskType => taskType.task_id)
    return {
      id: json.id,
      header: json.header,
      task_ids: taskIds
    }
  },
  execute: instance => instance.destroy()
}

module.exports = {
  create,
  delete: deleteType
}
