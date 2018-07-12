const { CourseInstance, Objective, Category, Task, SkillLevel, Type } = require('../database/models.js')

const getCourseInstanceData = async (courseInstanceId, lang) => {
  const name = [`${lang}_name`, 'name']

  const value = (await CourseInstance.findOne({
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
        attributes: ['id', name],
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

  mapObjectives(value)

  return value
}

const mapObjectives = (value) => {
  const categories = {}
  const skillLevels = {}
  value.objectives.forEach((objective) => {
    if (categories[objective.category.id] === undefined) {
      categories[objective.category.id] = objective.category
      skillLevels[objective.category.id] = {}
    }
    if (skillLevels[objective.category.id][objective.skill_level.id] === undefined) {
      skillLevels[objective.category.id][objective.skill_level.id] = [{
        id: objective.id,
        name: objective.name
      }]
    } else {
      skillLevels[objective.category.id][objective.skill_level.id].push({
        id: objective.id,
        name: objective.name
      })
    }
  })
  value.categories = Object.keys(categories).map(category => ({
    ...categories[category],
    skill_levels: Object.keys(skillLevels[category]).map(level => ({
      id: level,
      objectives: skillLevels[category][level]
    }))
  }))
  delete value.objectives
}

module.exports = {
  getCourseInstanceData
}
