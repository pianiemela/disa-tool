const {
  CourseInstance,
  Objective,
  Category,
  Task,
  SkillLevel,
  TypeHeader,
  Type,
  TaskObjective,
  TaskType,
  CoursePerson,
  Grade,
  CategoryGrade
} = require('../database/models.js')
const editServices = require('../utils/editServices.js')

const getOne = courseInstanceId => CourseInstance.findOne({ where: { id: courseInstanceId } })

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
        attributes: ['id', name]
      },
      {
        model: SkillLevel,
        attributes: ['id', name],
        include: {
          model: Objective,
          attributes: ['id', name, 'skill_level_id', 'category_id'],
          order: [['id', 'ASC']],
          separate: true
        }
      },
      {
        model: Task,
        attributes: ['id', name, 'info', description, 'max_points'],
        include: [
          {
            model: TaskObjective,
            attributes: ['task_id', 'multiplier', 'objective_id'],
            order: [['objective_id', 'ASC']],
            separate: true
          },
          {
            model: TaskType,
            attributes: ['task_id', 'type_id'],
            order: [['type_id', 'ASC']],
            separate: true
          }
        ]
      },
      {
        model: TypeHeader,
        attributes: ['id', name],
        include: {
          model: Type,
          attributes: ['id', name, 'multiplier', 'type_header_id'],
          order: [['id', 'ASC']],
          separate: true
        }
      }
    ],
    order: [
      [Category, 'id', 'ASC'],
      [SkillLevel, 'id', 'ASC'],
      [Task, 'id', 'ASC'],
      [TypeHeader, 'id', 'ASC']
    ]
  })).toJSON()

  value = mapCourse(value)
  value = mapObjectives(value)
  value = mapTasks(value)
  return value
}

// TODO: Refactor and test
const mapTasks = (value) => {
  const returnValue = { ...value }
  const objectiveMap = {}
  returnValue.categories = value.categories.map(category => ({
    ...category,
    skill_levels: category.skill_levels.map(level => ({
      ...level,
      objectives: level.objectives.map((objective) => {
        const newObjective = {
          ...objective,
          task_count: 0
        }
        objectiveMap[objective.id] = newObjective
        return newObjective
      })
    }))
  }))
  returnValue.tasks = value.tasks.map(task => ({
    ...task,
    objectives: task.task_objectives.map((taskObjective) => {
      objectiveMap[taskObjective.objective_id].task_count += 1
      return {
        id: taskObjective.objective_id,
        multiplier: taskObjective.multiplier
      }
    }),
    defaultMultiplier: task.task_types.map((tt) => {
      const types = value.type_headers.map((header) => {
        const type = header.types.find(t => tt.type_id === t.id)
        if (type) {
          return type.multiplier
        }
        return undefined
      })
      return types.filter(type => type !== undefined)
    }).reduce((acc, curr) => acc * curr, 1),
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
        category.id === objective.category_id
      )).map(objective => ({ ...objective, skill_level_id: undefined, category_id: undefined }))
    })),
    objectives: undefined
  }))
  returnValue.skill_levels = undefined
  return returnValue
}

const copyCourseInstance = async (data, user, lang) => {
  const names = ['eng_name', 'fin_name', 'swe_name']
  const descriptions = ['eng_description', 'fin_description', 'swe_description']
  const original = (await CourseInstance.findOne({
    where: {
      id: data.course_instance_id
    },
    attributes: ['id', ...names, 'course_id'],
    include: [
      {
        model: Category,
        attributes: ['id', ...names],
        include: {
          model: CategoryGrade,
          attributes: ['id', 'grade_id', 'category_id', 'needed_for_grade'],
          separate: true
        }
      },
      {
        model: SkillLevel,
        attributes: ['id', ...names],
        include: [
          {
            model: Objective,
            attributes: ['id', ...names, 'skill_level_id', 'category_id'],
            order: [['id', 'ASC']],
            separate: true
          },
          {
            model: Grade,
            attributes: ['id', ...names, 'needed_for_grade', 'skill_level_id', 'prerequisite'],
            order: [['id', 'ASC']],
            separate: true
          }
        ]
      },
      {
        model: Task,
        attributes: ['id', ...names, 'info', ...descriptions, 'max_points'],
        include: [
          {
            model: TaskObjective,
            attributes: ['task_id', 'multiplier', 'objective_id'],
            order: [['objective_id', 'ASC']],
            separate: true
          },
          {
            model: TaskType,
            attributes: ['task_id', 'type_id'],
            order: [['type_id', 'ASC']],
            separate: true
          }
        ]
      },
      {
        model: TypeHeader,
        attributes: ['id', ...names],
        include: {
          model: Type,
          attributes: ['id', ...names, 'multiplier', 'type_header_id'],
          order: [['id', 'ASC']],
          separate: true
        }
      }
    ],
    order: [
      [Category, 'id', 'ASC'],
      [SkillLevel, 'id', 'ASC'],
      [Task, 'id', 'ASC'],
      [TypeHeader, 'id', 'ASC']
    ]
  })).toJSON()
  let copyData = mapToBuild(data, original)
  copyData = inferRequirements(copyData)
  const built = await buildCopy(copyData)
  const copy = built.find(table => table.model === CourseInstance).instances[0]
  await CoursePerson.create({
    course_instance_id: copy.dataValues.id,
    person_id: user.id,
    role: 'TEACHER'
  })
  return create.value(copy, lang)
}

const mapNames = node => ({
  eng_name: node.eng_name,
  fin_name: node.fin_name,
  swe_name: node.swe_name
})

const mapDescriptions = node => ({
  eng_description: node.eng_description,
  fin_description: node.fin_description,
  swe_description: node.swe_description
})

const reference = (table, ref) => ({
  table: table.name,
  ref
})

const mapToBuild = (data, original) => {
  const copy = {
    ref: original.id,
    course_id: data.course_id,
    ...mapNames(data),
    active: false
  }
  return [
    {
      model: CourseInstance,
      data: [copy]
    },
    {
      model: Category,
      data: original.categories.map(category => ({
        ref: category.id,
        course_instance_id: reference(CourseInstance, copy.ref),
        ...mapNames(category)
      }))
    },
    {
      model: SkillLevel,
      data: original.skill_levels.map(level => ({
        ref: level.id,
        course_instance_id: reference(CourseInstance, copy.ref),
        ...mapNames(level)
      }))
    },
    {
      model: Objective,
      data: original.skill_levels.reduce(
        (acc, level) => acc.concat(level.objectives.map(objective => ({
          ref: objective.id,
          ...mapNames(objective),
          skill_level_id: reference(SkillLevel, objective.skill_level_id),
          category_id: reference(Category, objective.category_id)
        }))),
        []
      )
    },
    {
      model: Task,
      data: original.tasks.map(task => ({
        ref: task.id,
        course_instance_id: reference(CourseInstance, copy.ref),
        ...mapNames(task),
        info: task.info,
        ...mapDescriptions(task),
        max_points: task.max_points
      }))
    },
    {
      model: TaskObjective,
      data: original.tasks.reduce(
        (acc, task) => acc.concat(task.task_objectives.map(to => ({
          multiplier: to.multiplier,
          task_id: reference(Task, to.task_id),
          objective_id: reference(Objective, to.objective_id)
        }))),
        []
      )
    },
    {
      model: TypeHeader,
      data: original.type_headers.map(th => ({
        ref: th.id,
        course_instance_id: reference(CourseInstance, copy.ref),
        ...mapNames(th)
      }))
    },
    {
      model: Type,
      data: original.type_headers.reduce(
        (acc, th) => acc.concat(th.types.map(type => ({
          ref: type.id,
          multiplier: type.multiplier,
          ...mapNames(type),
          type_header_id: reference(TypeHeader, type.type_header_id)
        }))),
        []
      )
    },
    {
      model: TaskType,
      data: original.tasks.reduce(
        (acc, task) => acc.concat(task.task_types.map(tt => ({
          task_id: reference(Task, tt.task_id),
          type_id: reference(Type, tt.type_id)
        }))),
        []
      )
    },
    {
      model: Grade,
      circular: 'prerequisite',
      data: original.skill_levels.reduce(
        (acc, level) => acc.concat(level.grades.map(grade => ({
          ref: grade.id,
          ...mapNames(grade),
          needed_for_grade: grade.needed_for_grade,
          skill_level_id: reference(SkillLevel, grade.skill_level_id),
          prerequisite: reference(Grade, grade.prerequisite)
        }))),
        []
      )
    },
    {
      model: CategoryGrade,
      data: original.categories.reduce(
        (acc, category) => acc.concat(category.category_grades.map(cg => ({
          needed_for_grade: cg.needed_for_grade,
          category_id: reference(Category, cg.category_id),
          grade_id: reference(Grade, cg.grade_id)
        }))),
        []
      )
    }
  ]
}

const inferRequirements = data => data.map(table => ({
  ...table,
  requires: table.data.length === 0 ? [] : Object.values(table.data[0]).reduce(
    (acc, value) => {
      if (!value || !value.table || value.table === table.model.name) { return acc }
      return [...acc, value.table]
    },
    []
  )
}))

const applyRefs = (refs, row) => {
  const newRow = { ...row, ref: undefined }
  Object.entries(newRow).forEach(([key, value]) => {
    if (!value || !value.table) { return }
    newRow[key] = refs[value.table][value.ref]
  })
  return newRow
}

const orderByCircularField = (data, field) => {
  let done = []
  let nextNodes = [undefined]
  const nodeMapper = row => row[field]
  while (done.length < data.length) {
    // The filter depends on the value of nextNodes and as such must be remade every pass.
    const next = data.filter(row => nextNodes.includes(row[field])) // eslint-disable-line no-loop-func
    nextNodes = next.map(nodeMapper)
    done = done.concat(next)
  }
  return done
}

const buildCopy = async (data) => {
  const refs = {}
  let built = []
  let left = data
  const nextFilter = table => table.requires.reduce(
    (acc, requirement) => acc && built.map(builtTable => builtTable.model.name).includes(requirement),
    true
  )
  const buildTable = async (table) => {
    const { circular } = table
    const newTable = { ...table, requires: undefined, circular: undefined }
    if (circular) {
      newTable.data = orderByCircularField(data, circular)
    }
    if (newTable.data.length !== 0) {
      refs[newTable.model.name] = {}
      newTable.instances = newTable.data.map(row => newTable.model.build(applyRefs(refs, row)))
      newTable.instances = await Promise.all(newTable.instances.map(instance => instance.save()))
      newTable.instances.forEach((instance, index) => {
        const { ref } = newTable.data[index]
        if (ref) { refs[newTable.model.name][ref] = instance.dataValues.id }
      })
    } else {
      newTable.instances = []
    }
    delete newTable.data
    return newTable
  }
  while (left.length > 0) {
    const next = left.filter(nextFilter)
    // eslint-disable-next-line no-await-in-loop
    built = built.concat(await Promise.all(next.map(buildTable)))
    left = left.filter(table => !next.map(nextTable => nextTable.model.name).includes(table.model.name))
  }
  return built
}

const create = {
  prepare: data => CourseInstance.build({
    course_id: data.course_id,
    eng_name: data.eng_name,
    fin_name: data.fin_name,
    swe_name: data.swe_name,
    active: false
  }),
  execute: (instance, user) => instance.save().then(result => CoursePerson.create({
    course_instance_id: result.dataValues.id,
    person_id: user.id,
    role: 'TEACHER'
  })),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
      active: json.active,
      registered: 'TEACHER'
    }
  }
}

const matrix = async (id, lang) => {
  const name = [`${lang}_name`, 'name']
  let result = await CourseInstance.findById(id, {
    attributes: ['id', name],
    include: [
      {
        model: Category,
        attributes: ['id', name]
      },
      {
        model: SkillLevel,
        attributes: ['id', name],
        include: {
          model: Objective,
          attributes: ['id', 'category_id', 'skill_level_id', name],
          order: [['id', 'ASC']],
          separate: true
        }
      }
    ],
    order: [
      [Category, 'id', 'ASC'],
      [SkillLevel, 'id', 'ASC']
    ]
  })
  if (!result) return null
  result = result.toJSON()
  result = mapObjectives(result)
  result = mapCourse(result)
  return result
}

const { details, edit } = editServices(
  CourseInstance,
  {
    attributes: ['id', 'eng_name', 'fin_name', 'swe_name']
  },
  {
    saveFields: [
      'eng_name',
      'fin_name',
      'swe_name'
    ],
    valueFields: [
      'id',
      ['lang_name', 'name']
    ]
  }
)

module.exports = {
  getCourseInstanceData,
  getOne,
  create,
  matrix,
  details,
  edit,
  copy: copyCourseInstance
}
