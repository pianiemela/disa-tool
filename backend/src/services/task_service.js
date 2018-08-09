const { Op } = require('sequelize')
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

const validateTaskResponses = async (taskResponses, courseId) => {
  const tasks = await Task.findAll({ where: { id: { [Op.in]: taskResponses.map(resp => resp.taskId) } } })
  const validatedResponses = taskResponses.map((r) => {
    const originalTask = tasks.find(t => t.dataValues.id === r.taskId)
    if (originalTask.course_instance_id !== courseId) {
      return null
    }
    return {
      responseId: r.responseId,
      task_id: r.taskId,
      person_id: r.personId,
      points: r.points <= originalTask.max_points ? r.points : originalTask.max_points }
  })
  const updateResponses = validatedResponses.filter(resp => resp.responseId !== undefined)
  const newResponses = validatedResponses.filter(resp => resp.responseId === undefined)
  return { updateResponses, newResponses }
}

const createTaskResponses = taskResponses => (
  TaskResponse.bulkCreate(taskResponses, { returning: true })
)

const updateTaskResponses = taskResponses => (
  Promise.all(taskResponses.map((resp) => {
    if (resp.points !== null) {
      return TaskResponse.update({ points: resp.points }, { where: { id: resp.responseId }, returning: true })
        .then(res => res[1][0])
    }
    TaskResponse.destroy({ where: { id: resp.responseId } })
  }))
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
  execute: async (instance) => {
    const createdTaskType = await instance.save({ returning: true })
    const taskTypes = await Type.findAll({ include: { model: TaskType, where: { task_id: createdTaskType.task_id } } })
    const multiplier = taskTypes.reduce((acc, curr) => acc * curr.dataValues.multiplier, 1)
    const taskObjectives = await TaskObjective.findAll({ where: { task_id: instance.task_id } })
    const updatedObjectives = await Promise.all(taskObjectives.map(taskO => (
      TaskObjective.update({ multiplier }, { where: { id: taskO.dataValues.id }, returning: true })
        .then(res => res[1][0])
    )))
    return { createdTaskType, updatedObjectives, multiplier }
  },
  value: (instance, updatedObjectives, multiplier) => {
    const json = instance.toJSON()
    return {
      task_id: json.task_id,
      type_id: json.type_id,
      updatedObjectives,
      multiplier
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

const details = id => Task.findById(id, {
  attributes: {
    exclude: ['updated_at', 'created_at']
  }
})

const edit = {
  prepare: id => Task.findById(id, {
    attributes: ['id', 'course_instance_id']
  }),
  execute: (instance, data) => instance.update({
    eng_name: data.eng_name,
    fin_name: data.fin_name,
    swe_name: data.swe_name,
    eng_description: data.eng_description,
    fin_description: data.fin_description,
    swe_description: data.swe_description,
    info: data.info
  }),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
      description: json[`${lang}_description`],
      info: json.info
    }
  }
}

module.exports = {
  getUserTasksForCourse,
  getTasksForCourse,
  validateTaskResponses,
  createTaskResponses,
  updateTaskResponses,
  create,
  delete: deleteTask,
  attachObjective,
  detachObjective,
  attachType,
  detachType,
  details,
  edit
}
