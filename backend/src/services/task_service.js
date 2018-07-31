const { Task, TaskResponse, Type, Objective, TaskObjective, TaskType, TypeHeader } = require('../database/models.js')

const taskAttributes = lang => ['id', [`${lang}_name`, 'name'], [`${lang}_description`, 'description'], 'max_points']
const typeAttributes = lang => ['id', [`${lang}_header`, 'header'], [`${lang}_name`, 'name']]

const getUserTasksForCourse = (userId, courseId, lang) => (
  Task.findAll({
    attributes: taskAttributes(lang),
    where: { course_instance_id: courseId },
    include: { model: TaskResponse, where: { person_id: userId } }
  })
)

const getTasksForCourse = (courseId, lang, userId) => (
  Task.findAll({
    where: { course_instance_id: courseId },
    attributes: taskAttributes(lang),
    include: [{ model: TaskResponse, where: { person_id: userId }, required: false },
      { model: Type, attributes: typeAttributes(lang) }] })
)

const create = {
  prepare: data => Task.build({
    course_instance_id: data.course_instance_id,
    eng_name: data.eng_name,
    fin_name: data.fin_name,
    swe_name: data.swe_name,
    eng_description: data.eng_description,
    fin_description: data.fin_description,
    swe_description: data.swe_description,
    info: data.info
  }),
  execute: instance => instance.save(),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
      description: json[`${lang}_description`],
      info: json.info,
      objectives: [],
      types: []
    }
  }
}

const deleteTask = {
  prepare: async id => Task.findById(id),
  value: (instance) => {
    const json = instance.toJSON()
    return {
      id: json.id
    }
  },
  execute: instance => instance.destroy()
}

const attachObjective = {
  prepare: async (data) => {
    const task = await Task.findById(data.task_id)
    const objective = await Objective.findById(data.objective_id)
    const instance = TaskObjective.build({
      task_id: data.task_id,
      objective_id: data.objective_id
    })
    return {
      task: task.toJSON(),
      objective: objective.toJSON(),
      instance
    }
  },
  execute: instance => instance.save(),
  value: (instance) => {
    const json = instance.toJSON()
    return {
      task_id: json.task_id,
      objective_id: json.objective_id
    }
  }
}

const detachObjective = {
  prepare: data => TaskObjective.findOne({
    where: {
      task_id: data.task_id,
      objective_id: data.objective_id
    },
    include: [
      {
        model: Task
      },
      {
        model: Objective
      }
    ]
  }),
  value: (instance) => {
    const json = instance.toJSON()
    return {
      task_id: json.task_id,
      objective_id: json.objective_id
    }
  },
  execute: instance => instance.destroy()
}

const attachType = {
  prepare: async (data) => {
    const task = await Task.findById(data.task_id)
    const type = await Type.findById(data.type_id, {
      include: {
        model: TypeHeader
      }
    })
    const instance = TaskType.build({
      task_id: data.task_id,
      type_id: data.type_id
    })
    return {
      task: task.toJSON(),
      type: type.toJSON(),
      instance
    }
  },
  execute: instance => instance.save(),
  value: (instance) => {
    const json = instance.toJSON()
    return {
      task_id: json.task_id,
      type_id: json.type_id
    }
  }
}

const detachType = {
  prepare: data => TaskType.findOne({
    where: {
      task_id: data.task_id,
      type_id: data.type_id
    },
    include: [
      {
        model: Task
      },
      {
        model: Type,
        include: {
          model: TypeHeader
        }
      }
    ]
  }),
  value: (instance) => {
    const json = instance.toJSON()
    return {
      task_id: json.task_id,
      type_id: json.type_id
    }
  },
  execute: instance => instance.destroy()
}

module.exports = {
  getUserTasksForCourse,
  getTasksForCourse,
  create,
  delete: deleteTask,
  attachObjective,
  detachObjective,
  attachType,
  detachType
}
