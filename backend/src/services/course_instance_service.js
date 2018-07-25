const { CourseInstance, Objective, Category, Task, SkillLevel, TypeHeader, Type, TaskObjective, TaskType } = require('../database/models.js')

const getCourseInstanceData = async (courseInstanceId, lang) => {
  const name = [`${lang}_name`, 'name']
  const description = [`${lang}_description`, 'description']

  let value = (await CourseInstance.findOne({
    where: {
      id: courseInstanceId
    },
    attributes: ['id', name],
    include: [
      {
        model: Category,
        attributes: ['id', name],
        include: {
          model: Objective,
          attributes: ['id', 'category_id'],
          separate: true
        }
      },
      {
        model: SkillLevel,
        attributes: ['id', name],
        include: {
          model: Objective,
          attributes: ['id', name, 'skill_level_id'],
          separate: true
        }
      },
      {
        model: Task,
        attributes: ['id', name, 'info', description],
        include: [
          {
            model: TaskObjective,
            attributes: ['task_id', 'multiplier', 'objective_id'],
            separate: true
          },
          {
            model: TaskType,
            attributes: ['task_id', 'type_id'],
            separate: true
          }
        ]
      },
      {
        model: TypeHeader,
        attributes: ['id', name],
        include: {
          model: Type,
          attributes: ['id', name, 'multiplier']
        }
      }
    ]
  })).toJSON()

  value = mapCourse(value)
  value = mapObjectives(value)
  value = mapTasks(value)
  return value
}

const mapTasks = (value) => {
  const returnValue = { ...value }
  returnValue.tasks = value.tasks.map(task => ({
    ...task,
    objectives: task.task_objectives.map(taskObjective => ({
      id: taskObjective.objective_id,
      multiplier: taskObjective.multiplier
    })),
    task_objectives: undefined,
    types: task.task_types.map(taskType => taskType.type_id),
    task_types: undefined
  }))
  return returnValue
}

const mapCourse = (value) => {
  const returnValue = { ...value }
  returnValue.course = {
    id: returnValue.id,
    name: returnValue.name
  }
  delete returnValue.id
  delete returnValue.name
  return returnValue
}

const mapObjectives = (value) => {
  const returnValue = { ...value }
  returnValue.levels = value.skill_levels.map(skillLevel => ({
    ...skillLevel,
    objectives: undefined
  }))
  returnValue.categories = value.categories.map(category => ({
    ...category,
    skill_levels: value.skill_levels.map(skillLevel => ({
      ...skillLevel,
      name: undefined,
      objectives: skillLevel.objectives.filter(objective => (
        category.objectives.find(catObjective => objective.id === catObjective.id) !== undefined
      ))
    })),
    objectives: undefined
  }))
  return returnValue
}

module.exports = {
  getCourseInstanceData
}
