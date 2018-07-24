const { Type, TaskType } = require('../database/models.js')

const create = {
  prepare: data => Type.build({
    eng_name: data.eng_name,
    fin_name: data.fin_name,
    swe_name: data.swe_name,
    course_instance_id: data.course_instance_id
  }),
  execute: instance => instance.save(),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
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
      id: Number(json.id),
      task_ids: taskIds
    }
  },
  execute: instance => instance.destroy()
}

module.exports = {
  create,
  delete: deleteType
}
