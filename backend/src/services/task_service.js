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
      studentnumber: r.studentnumber,
      responseId: r.responseId,
      task_id: r.taskId,
      person_id: r.personId,
      points: r.points <= originalTask.max_points ? r.points : originalTask.max_points }
  })
  const updateResponses = validatedResponses.filter(resp => resp.responseId !== undefined && resp.studentnumber === undefined)
  const newResponses = validatedResponses.filter(resp => resp.responseId === undefined && resp.studentnumber === undefined)
  const nonRegResponses = validatedResponses.filter(resp => resp.responseId === undefined && resp.studentnumber !== undefined)
  return { updateResponses, newResponses, nonRegResponses }
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

const mapPersonsAndResponses = (taskResponses, coursePersons) => (
  taskResponses.map(resp => ({
    person_id: coursePersons.find(person => person.studentnumber === resp.studentnumber).person_id,
    task_id: resp.task_id,
    points: resp.points
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
    const task = await Task.findById(data.task_id, {
      include: {
        model: Type,
        attributes: ['multiplier']
      }
    })
    const objective = await Objective.findById(data.objective_id)
    const multiplier = task.get({ plain: true }).types.reduce((acc, curr) => acc * curr.multiplier, 1)
    const instance = TaskObjective.build({
      task_id: data.task_id,
      objective_id: data.objective_id,
      multiplier
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

const updateMultipliers = async (taskType) => {
  const taskTypes = await TaskType.findAll({
    attributes: ['id', 'task_id', 'type_id'],
    where: {
      task_id: taskType.task_id
    },
    include: {
      model: Type,
      attributes: ['id', 'multiplier']
    }
  })
  const multiplier = taskTypes.reduce((acc, curr) => acc * curr.type.multiplier, 1)
  const taskObjectives = (await TaskObjective.update(
    {
      multiplier
    },
    {
      where: {
        task_id: taskType.task_id,
        modified: false
      },
      returning: true
    }
  ))[1].map((taskObjective) => {
    const json = taskObjective.toJSON()
    return {
      id: json.objective_id,
      multiplier: json.multiplier
    }
  })
  return { taskObjectives, multiplier }
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
    const deleteInstance = await TaskType.findOne({
      where: {
        task_id: task.id
      },
      attributes: ['id', 'task_id', 'type_id'],
      include: {
        model: Type,
        where: {
          type_header_id: type.type_header_id
        },
        attributes: ['id']
      }
    })
    return {
      task: task.toJSON(),
      type: type.toJSON(),
      deleteInstance,
      instance
    }
  },
  execute: async (instance, deleteInstance) => {
    if (deleteInstance) await deleteInstance.destroy()
    const createdTaskType = await instance.save({ returning: true })
    const { taskObjectives, multiplier } = await updateMultipliers(createdTaskType)
    return { taskObjectives, multiplier }
  },
  value: (instance, deleteInstance) => {
    const json = instance.toJSON()
    const created = {
      task_id: json.task_id,
      type_id: json.type_id
    }
    let deleted
    if (deleteInstance) {
      const deleteJson = deleteInstance.toJSON()
      deleted = {
        task_id: deleteJson.task_id,
        type_id: deleteJson.type_id
      }
    } else { deleted = null }
    return {
      created,
      deleted
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
  execute: async (instance) => {
    const instanceGhost = instance.toJSON()
    await instance.destroy()
    const updates = await updateMultipliers(instanceGhost)
    return updates
  }
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

const editTaskObjectives = {
  prepare: (data) => {
    const objectiveIds = data.objectives.map(objective => objective.id)
    return Promise.all([
      TaskObjective.findAll({
        where: {
          task_id: data.task_id,
          objective_id: { [Op.in]: objectiveIds }
        },
        attributes: ['id', 'objective_id']
      }),
      Task.findById(data.task_id, { attributes: ['id', 'course_instance_id'] }),
      Objective.findAll({
        where: {
          id: { [Op.in]: objectiveIds }
        },
        attributes: ['id'],
        include: {
          model: TaskObjective,
          where: {
            task_id: data.task_id
          }
        }
      })
    ])
  },
  execute: (instances, data) => Promise.all(instances.map((instance) => {
    const dataObjective = data.objectives.find(objective => objective.id === instance.dataValues.objective_id)
    instance.update({
      multiplier: Number(dataObjective.multiplier),
      modified: dataObjective.modified
    })
  })),
  value: (instances, data) => {
    const json = instances.map(instance => instance.toJSON())
    return {
      task_id: data.task_id,
      task_objectives: json.map(instance => ({
        multiplier: instance.multiplier,
        objective_id: instance.objective_id,
        modified: instance.modified
      }))
    }
  }
}

module.exports = {
  getUserTasksForCourse,
  getTasksForCourse,
  validateTaskResponses,
  createTaskResponses,
  updateTaskResponses,
  mapPersonsAndResponses,
  create,
  delete: deleteTask,
  attachObjective,
  detachObjective,
  attachType,
  detachType,
  details,
  edit,
  editTaskObjectives
}
