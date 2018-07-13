const { CourseInstance, Objective, Category, Task, SkillLevel, Type } = require('../database/models.js')

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
        model: Objective,
        attributes: ['id', name],
        include: [
          {
            model: Category,
            attributes: ['id', name]
          },
          {
            model: SkillLevel,
            attributes: ['id', name]
          }
        ]
      },
      {
        model: Task,
        attributes: ['id', name, 'info', description],
        include: [
          {
            model: Objective,
            attributes: ['id', name],
            through: {
              attributes: ['multiplier']
            }
          },
          {
            model: Type,
            attributes: ['id', name],
            through: {
              attributes: []
            }
          }
        ]
      },
      {
        model: Type,
        attributes: ['id', name, 'multiplier']
      }
    ]
  })).toJSON()

  value = mapCourse(value)
  value = mapObjectives(value)
  value = mapTaskObjectives(value)
  return value
}

const mapTaskObjectives = (value) => {
  const returnValue = { ...value }
  returnValue.tasks = returnValue.tasks.map(task => ({
    ...task,
    objectives: task.objectives.map((objective) => {
      const returnObjective = { ...objective, multiplier: objective.task_objective.multiplier }
      delete returnObjective.task_objective
      return returnObjective
    })
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
  const categories = {}
  const categorySkillLevels = {}
  const skillLevels = {}
  value.objectives.forEach((objective) => {
    if (categories[objective.category.id] === undefined) {
      categories[objective.category.id] = objective.category
      categorySkillLevels[objective.category.id] = {}
    }
    if (categorySkillLevels[objective.category.id][objective.skill_level.id] === undefined) {
      categorySkillLevels[objective.category.id][objective.skill_level.id] = [{
        id: objective.id,
        name: objective.name
      }]
    } else {
      categorySkillLevels[objective.category.id][objective.skill_level.id].push({
        id: objective.id,
        name: objective.name
      })
    }
    if (skillLevels[objective.skill_level.id] === undefined) {
      skillLevels[objective.skill_level.id] = objective.skill_level
    }
  })
  returnValue.categories = Object.keys(categories).map(category => ({
    ...categories[category],
    skill_levels: Object.keys(categorySkillLevels[category]).map(level => ({
      id: Number(level),
      objectives: categorySkillLevels[category][level]
    }))
  }))
  delete returnValue.objectives
  returnValue.levels = Object.keys(skillLevels).map(level => skillLevels[level])
  return returnValue
}

module.exports = {
  getCourseInstanceData
}
