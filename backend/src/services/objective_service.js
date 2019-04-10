const { Objective, TaskObjective, Category, SkillLevel, Task } = require('../database/models.js')
const editServices = require('../utils/editServices.js')

const create = {
  prepare: async (data) => {
    const instance = Objective.build({
      eng_name: data.eng_name,
      fin_name: data.fin_name,
      swe_name: data.swe_name,
      course_instance_id: data.course_instance_id,
      category_id: data.category_id,
      skill_level_id: data.skill_level_id,
      order: data.order
    })
    const [category, skillLevel] = await Promise.all([
      Category.findById(data.category_id, {
        attributes: ['course_instance_id']
      }),
      SkillLevel.findById(data.skill_level_id, {
        attributes: ['course_instance_id']
      })
    ])
    return {
      instance,
      category,
      skillLevel
    }
  },
  execute: instance => instance.save(),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
      category_id: json.category_id,
      skill_level_id: json.skill_level_id,
      order: json.order
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

const taskDetails = async (id, lang) => {
  const name = [`${lang}_name`, 'name']
  const result = (await Objective.findById(id, {
    attributes: ['id', name],
    include: {
      required: false,
      model: Task,
      attributes: [name],
      through: {
        attributes: ['multiplier']
      }
    },
    order: [
      [Task, 'order', 'ASC']
    ]
  })).toJSON()
  result.tasks = result.tasks.map(task => ({
    ...task,
    multiplier: task.task_objective.multiplier,
    types: undefined,
    task_objective: undefined
  }))
  return result
}

const { details, edit } = editServices(
  Objective,
  {},
  {
    attributes: ['id', 'category_id', 'skill_level_id', 'eng_name', 'fin_name', 'swe_name'],
    include: [
      {
        model: Category,
        attributes: ['id', 'course_instance_id']
      },
      {
        model: SkillLevel,
        attributes: ['id', 'course_instance_id']
      }
    ],
    saveFields: [
      'eng_name',
      'fin_name',
      'swe_name',
      'category_id',
      'skill_level_id',
      'order'
    ],
    valueFields: [
      'id',
      ['lang_name', 'name'],
      'category_id',
      'skill_level_id',
      'order'
    ]
  }
)

const getObjectivesBySkillCourseCategory = (skillLevelId, courseInstanceId, categoryId) => (
  Objective.findAll({
    where: {
      skill_level_id: skillLevelId,
      course_instance_id: courseInstanceId,
      category_id: categoryId
    },
    include: Task
  })
)

const getByCourseInstance = {
  execute: (id, lang) => Promise.all([
    Category.findAll({
      where: {
        course_instance_id: id
      },
      attributes: ['id', [`${lang}_name`, 'name'], 'order'],
      include: {
        model: Objective,
        attributes: ['id', [`${lang}_name`, 'name'], 'skill_level_id', 'order']
      }
    }),
    SkillLevel.findAll({
      where: {
        course_instance_id: id
      },
      attributes: ['id', 'order']
    })
  ]),
  value: ([categories, skillLevels]) => {
    const skillLevelOrderMap = skillLevels.reduce(
      (acc, level) => ({
        ...acc,
        [level.id]: level.order
      }),
      {}
    )
    const protoResult = categories.reduce(
      (acc, category) => acc.concat(category.objectives.map(objective => ({
        ...objective.toJSON(),
        categoryOrder: category.order,
        skillLevelOrder: skillLevelOrderMap[objective.skill_level_id]
      }))),
      []
    )
    return protoResult.sort((a, b) => {
      if (a.categoryOrder !== b.categoryOrder) {
        return a.categoryOrder - b.categoryOrder
      }
      if (a.skillLevelOrder !== b.skillLevelOrder) {
        return a.skillLevelOrder - b.skillLevelOrder
      }
      return a.order - b.order
    }).map(objective => ({
      id: objective.id,
      name: objective.name
    }))
  }
}

module.exports = {
  create,
  delete: deleteObjective,
  taskDetails,
  details,
  edit,
  getObjectivesBySkillCourseCategory,
  getByCourseInstance
}
