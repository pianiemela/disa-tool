const { Objective, TaskObjective } = require('../database/models.js')

const create = {
  prepare: data => Objective.build({
    eng_name: data.eng_name,
    fin_name: data.fin_name,
    swe_name: data.swe_name,
    course_instance_id: data.course_instance_id,
    category_id: data.category_id,
    skill_level_id: data.skill_level_id
  }),
  execute: instance => instance.save(),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
      category_id: json.category_id,
      skill_level_id: json.skill_level_id
    }
  }
}

const deleteObjective = {
  prepare: id => Objective.findById(id, {
    include: {
      model: TaskObjective,
      attributes: ['task_id']
    }
  }),
  value: (instance) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      category_id: json.category_id,
      skill_level_id: json.skill_level_id,
      task_ids: json.task_objectives.map(taskObjective => taskObjective.task_id)
    }
  },
  execute: instance => instance.destroy()
}

module.exports = {
  create,
  delete: deleteObjective
}
