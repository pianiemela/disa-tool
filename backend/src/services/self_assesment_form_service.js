const {
  SelfAssessmentForm,
  FinalGradeQuestion,
  OpenQuestion,
  CategoryQuestion,
  ObjectiveQuestion,
  Person,
  Response,
  Task,
  TaskResponse,
  Category,
  SkillLevel,
  Objective,
  TaskObjective,
  CategoryResponse,
  CategoryGrade,
  CourseInstance,
  Grade,
  TypeHeader,
  Type,
  TaskType,
  FinalGradeResponse,
  CoursePerson,
  OpenResponse
} = require('../database/models')

const create = {
  prepare: input => input, // TODO: validate inputs
  execute: input => SelfAssessmentForm.create({
    course_instance_id: input.course_instance_id,
    eng_name: input.eng_name,
    fin_name: input.fin_name,
    swe_name: input.swe_name,
    eng_instructions: input.eng_instructions,
    fin_instructions: input.fin_instructions,
    swe_instructions: input.swe_instructions,
    type: input.type,
    open: false,
    active: false,
    show_feedback: false
  }),
  value: instance => ({
    id: instance.id,
    course_instance_id: instance.course_instance_id,
    eng_name: instance.eng_name,
    fin_name: instance.fin_name,
    swe_name: instance.swe_name,
    eng_instructions: instance.eng_instructions,
    fin_instructions: instance.fin_instructions,
    swe_instructions: instance.swe_instructions,
    type: instance.type,
    open: false,
    active: false,
    show_feedback: false
  })
}

const deleteService = {
  prepare: id => SelfAssessmentForm.findByPk(id),
  execute: instance => instance.destroy(),
  value: instance => ({ id: instance.id })
}

const getOne = id => SelfAssessmentForm.findByPk(id, {
  attributes: [
    'id',
    'eng_name',
    'fin_name',
    'swe_name',
    'eng_instructions',
    'fin_instructions',
    'swe_instructions',
    'open',
    'active',
    'show_feedback',
    'type',
    'course_instance_id'
  ]
})

const getData = {
  prepare: id => SelfAssessmentForm.findByPk(id),
  execute: ({ id }) => SelfAssessmentForm.findByPk(id, {
    attributes: [
      'id',
      'eng_name',
      'fin_name',
      'swe_name',
      'eng_instructions',
      'fin_instructions',
      'swe_instructions',
      'open',
      'active',
      'show_feedback',
      'type',
      'course_instance_id'
    ],
    includes: [
      {
        model: FinalGradeQuestion,
        attributes: [
          'id',
          'eng_prompt',
          'fin_prompt',
          'swe_prompt',
          'text_field'
        ]
      },
      {
        model: OpenQuestion,
        attributes: [
          'id',
          'eng_prompt',
          'fin_prompt',
          'swe_prompt',
          'order'
        ]
      },
      {
        model: CategoryQuestion,
        attributes: [
          'id',
          'category_id',
          'text_field',
          'order'
        ]
      },
      {
        model: ObjectiveQuestion,
        attributes: [
          'id',
          'objective_id',
          'order'
        ]
      }
    ]
  }),
  value: instance => instance.toJSON()
}

const edit = {
  prepare: (id, inputs) => {
    // TODO: validate inputs
    return SelfAssessmentForm.findByPk(id, {
      attributes: [
        'id',
        'eng_name',
        'fin_name',
        'swe_name',
        'eng_instructions',
        'fin_instructions',
        'swe_instructions',
        'open',
        'active',
        'show_feedback',
        'course_instance_id'
      ]
    })
  },
  execute: (instance, inputs) => {
    [
      'eng_name',
      'fin_name',
      'swe_name',
      'eng_instructions',
      'fin_instructions',
      'swe_instructions',
      'open',
      'active',
      'show_feedback'
    ].forEach((field) => {
      instance[field] = inputs[field]
    })
    return instance.save()
  },
  value: instance => instance.get()
}

const feedbackSelfAssessmentForm = (id, lang) => SelfAssessmentForm.findByPk(id, {
  attributes: ['id', 'type', 'course_instance_id'],
  include: [
    {
      separate: true,
      model: CategoryQuestion,
      attributes: ['id', 'category_id', 'self_assessment_form_id']
    },
    {
      separate: true,
      model: OpenQuestion,
      attributes: ['id', [`${lang}_prompt`, 'prompt'], 'self_assessment_form_id']
    },
    {
      model: CourseInstance,
      attributes: ['id'],
      include: [
        {
          separate: true,
          model: Category,
          attributes: ['id', [`${lang}_name`, 'name'], 'course_instance_id'],
          include: {
            model: CategoryGrade,
            attributes: ['needed_for_grade', 'grade_id']
          }
        },
        {
          separate: true,
          model: Task,
          attributes: ['id', 'max_points', 'course_instance_id'],
          include: {
            model: TaskType,
            attributes: ['type_id']
          }
        },
        {
          separate: true,
          model: TypeHeader,
          attributes: ['id', 'course_instance_id'],
          include: {
            model: Type,
            attributes: ['id', 'multiplier']
          }
        },
        {
          separate: true,
          model: SkillLevel,
          attributes: ['id', 'course_instance_id'],
          include: [
            {
              model: Objective,
              attributes: ['id', 'category_id'],
              include: {
                model: TaskObjective,
                attributes: ['task_id', 'multiplier']
              }
            },
            {
              model: Grade,
              attributes: ['id', 'needed_for_grade', 'skill_level_id', 'prerequisite']
            }
          ]
        }
      ]
    }
  ]
})
const feedbackParseSelfAssessmentForm = (selfAssessmentForm) => {
  const parsedGrades = getGradesWithDepth(selfAssessmentForm.course_instance.skill_levels)

  const parsedCategoryQuestionMap = selfAssessmentForm.category_questions.reduce(
    (acc, cq) => ({ ...acc, [cq.category_id]: cq.id }),
    {}
  )

  const typeMultiplierMap = selfAssessmentForm.course_instance.type_headers.reduce(
    (acc, typeHeader) => ({
      ...acc,
      ...typeHeader.types.reduce(
        (acc2, type) => ({
          ...acc2,
          [type.id]: type.multiplier
        }),
        {}
      )
    }),
    {}
  )

  const taskMap = selfAssessmentForm.course_instance.tasks.reduce(
    (acc, task) => ({
      ...acc,
      [task.id]: {
        ...task,
        multiplier: task.task_types.reduce(
          (acc2, taskType) => acc2 * typeMultiplierMap[taskType.type_id],
          1
        )
      }
    }),
    {}
  )

  const parsedCategories = selfAssessmentForm.course_instance.categories
    .filter(category => parsedCategoryQuestionMap[category.id])
    .map((category) => {
      const categoryGradeMap = category.category_grades.reduce(
        (acc, cg) => ({
          ...acc,
          [cg.grade_id]: cg.needed_for_grade
        }),
        {}
      )
      return {
        id: category.id,
        name: category.name,
        grades: parsedGrades.map(grade => ({
          id: grade.id,
          depth: grade.depth,
          skillLevelId: grade.skillLevelId,
          neededForGrade: categoryGradeMap[grade.id]
        }))
      }
    })

  const parsedSkillLevels = selfAssessmentForm.course_instance.skill_levels.map((level) => {
    return {
      id: level.id,
      categories: parsedCategories.reduce(
        (acc, category) => {
          const taskObjectives = level.objectives
            .filter(objective => objective.category_id === category.id)
            .reduce(
              (acc2, objective) => acc2.concat(
                objective.task_objectives.map(taskObjective => ({
                  ...taskObjective,
                  multiplier: (
                    typeof taskObjective.multiplier === 'number'
                      ? taskObjective.multiplier
                      : taskMap[taskObjective.task_id].multiplier
                  )
                }))
              ),
              []
            )
          return {
            ...acc,
            [category.id]: {
              maxPoints: taskObjectives.reduce(
                (acc2, taskObjective) => {
                  const multiplier = (
                    typeof taskObjective.multiplier === 'number'
                      ? taskObjective.multiplier
                      : taskMap[taskObjective.task_id].multiplier
                  )
                  return acc2 + (
                    multiplier * taskMap[taskObjective.task_id].max_points
                  )
                },
                0
              ),
              taskObjectives
            }
          }
        },
        {}
      )
    }
  })

  const parsedOpenQuestions = selfAssessmentForm.open_questions

  return {
    parsedGrades,
    parsedCategories,
    parsedSkillLevels,
    parsedOpenQuestions,
    parsedCategoryQuestionMap
  }
}
const feedbackParseStudent = ({
  parsedGrades,
  parsedCategoryQuestionMap,
  parsedCategories,
  parsedOpenQuestions
}) => (response) => {
  const finalGrade = (
    response.final_grade_response
      ? parsedGrades.find(grade => grade.id === response.final_grade_response.grade_id)
      : null
  )
  const openResponseTextMap = response.open_responses.reduce(
    (acc, openResponse) => ({
      ...acc,
      [openResponse.open_question_id]: openResponse.text
    }),
    {}
  )
  const categoryResponseMap = response.category_responses.reduce(
    (acc, categoryResponse) => ({
      ...acc,
      [categoryResponse.category_question_id]: {
        text: categoryResponse.text,
        grade_id: categoryResponse.grade_id
      }
    }),
    {}
  )
  return {
    id: response.person.id,
    studentnumber: response.person.studentnumber,
    name: response.person.name,
    responseGrades: parsedCategories.reduce(
      (acc, category) => {
        const categoryResponse = categoryResponseMap[parsedCategoryQuestionMap[category.id]]
        const responseGrade = parsedGrades.find(grade => grade.id === categoryResponse.grade_id)
        return {
          ...acc,
          [category.id]: {
            id: responseGrade.id,
            depth: responseGrade.depth,
            text: categoryResponse.text
          }
        }
      },
      {}
    ),
    openResponses: parsedOpenQuestions.map(openQuestion => ({
      id: openQuestion.id,
      prompt: openQuestion.prompt,
      text: openResponseTextMap[openQuestion.id] || null
    })),
    taskResponses: response.person.task_responses.reduce(
      (acc, taskResponse) => ({
        ...acc,
        [taskResponse.task_id]: taskResponse.points
      }),
      {}
    ),
    finalGradeResponse: (
      finalGrade
        ? {
          id: finalGrade.id,
          depth: finalGrade.depth,
          text: response.final_grade_response.text
        }
        : null
    )
  }
}

const feedback = {
  prepare: async (id, lang) => {
    const [responses, selfAssessmentForm] = await Promise.all([
      Response.findAll({
        where: {
          self_assessment_form_id: id
        },
        attributes: ['id'],
        include: [
          {
            model: Person,
            attributes: ['id', 'studentnumber', 'name'],
            include: {
              model: TaskResponse,
              attributes: ['task_id', 'points']
            }
          },
          {
            separate: true,
            model: CategoryResponse,
            attributes: ['grade_id', 'response_id', 'text', 'category_question_id'],
          },
          {
            separate: true,
            model: OpenResponse,
            attributes: ['response_id', 'text', 'open_question_id']
          },
          {
            model: FinalGradeResponse,
            required: false,
            attributes: ['grade_id', 'text']
          }
        ]
      }),
      feedbackSelfAssessmentForm(id, lang)
    ])
    // If you come across this code in a wonderful future where Sequelize isn't riddled with bugs
    // you can replace toJSON here with options.raw in the queries.
    // Currently options.raw has a bug that ruins arrays, so toJSON is to be used until it's fixed.
    return [
      responses.map(response => response.toJSON()),
      selfAssessmentForm.toJSON()
    ]
  },
  value: (responses, selfAssessmentForm) => {
    if (selfAssessmentForm.type === 'OBJECTIVES') {
      return responses.map(response => ({
        id: response.person.id,
        studentnumber: response.person.studentnumber,
        name: response.person.name
      }))
    }

    const parsedSelfAssessmentForm = feedbackParseSelfAssessmentForm(selfAssessmentForm)

    const parsedStudents = responses.map(feedbackParseStudent(parsedSelfAssessmentForm))

    const { parsedCategories, parsedSkillLevels, parsedGrades } = parsedSelfAssessmentForm

    const results = parsedStudents.map(student => ({
      id: student.id,
      studentnumber: student.studentnumber,
      name: student.name,
      categories: parsedCategories.map(category => ({
        id: category.id,
        name: category.name,
        responseGrade: student.responseGrades[category.id],
        feedbackGrade: getBestGrade(category, parsedSkillLevels, student.taskResponses)
      })),
      openResponses: student.openResponses,
      finalGrade: (
        student.finalGradeResponse
          ? {
            responseGrade: student.finalGradeResponse,
            feedbackGrade: getFinalGrade(parsedSkillLevels, student.taskResponses, parsedGrades)
          }
          : null
      )
    }))

    return results
  }
}

const getFinalGrade = (skillLevels, taskResponses, grades) => {
  const levelCompletions = skillLevels.reduce(
    (acc, level) => ({
      ...acc,
      [level.id]: {
        maxPoints: Object.values(level.categories).reduce(
          (acc2, category) => acc2 + category.maxPoints,
          0
        ),
        points: Object.values(level.categories).reduce(
          (acc2, category) => acc2 + (
            category.taskObjectives.reduce(
              (acc3, taskObjective) => acc3 + (
                taskObjective.multiplier * (
                  taskResponses[taskObjective.task_id] || 0
                )
              ),
              0
            )
          ),
          0
        )
      }
    }),
    {}
  )
  return grades.reduce(
    (acc, grade) => {
      if (acc) return acc
      const level = levelCompletions[grade.skillLevelId]
      const gradeValue = {
        id: grade.id,
        depth: grade.depth
      }
      if (level.maxPoints === 0) return gradeValue
      const proportion = level.points / level.maxPoints
      return (
        proportion >= grade.neededForGrade
          ? gradeValue
          : acc
      )
    },
    null
  )
}

const getBestGrade = (category, skillLevels, taskResponses) => {
  const levelCompletions = skillLevels.reduce(
    (acc, level) => ({
      ...acc,
      [level.id]: {
        maxPoints: level.categories[category.id].maxPoints,
        points: level.categories[category.id].taskObjectives.reduce(
          (acc2, taskObjective) => acc2 + (
            taskObjective.multiplier * (
              taskResponses[taskObjective.task_id] || 0
            )
          ),
          0
        )
      }
    }),
    {}
  )
  return category.grades.reduce(
    (acc, grade) => {
      if (acc) return acc
      const level = levelCompletions[grade.skillLevelId]
      const gradeValue = {
        id: grade.id,
        depth: grade.depth
      }
      if (level.maxPoints === 0) return gradeValue
      const proportion = level.points / level.maxPoints
      return (
        proportion >= grade.neededForGrade
          ? gradeValue
          : acc
      )
    },
    null
  )
}


const getGradesWithDepth = (levels) => {
  const grades = levels.reduce(
    (acc, level) => acc.concat(level.grades),
    []
  )
  let depth = 0
  let result = grades
    .filter(grade => !grade.prerequisite)
    .map(grade => ({ ...grade, depth }))
  while (grades.length > result.length) {
    const children = result
      // eslint-disable-next-line no-loop-func
      .filter(grade => grade.depth === depth)
      .map(grade => grade.id)
    depth += 1
    result = result.concat(
      grades
        .filter(grade => children.includes(grade.prerequisite))
        // eslint-disable-next-line no-loop-func
        .map(grade => ({ ...grade, depth }))
    )
  }
  return result.reverse().map(grade => ({
    id: grade.id,
    neededForGrade: grade.needed_for_grade,
    skillLevelId: grade.skill_level_id,
    depth: grade.depth
  }))
}

const individualFeedback = {
  prepare: async (id, userId, lang) => {
    const [response, selfAssessmentForm] = await Promise.all([
      Response.findOne({
        where: {
          self_assessment_form_id: id
        },
        attributes: ['id'],
        include: [
          {
            model: Person,
            where: {
              id: userId
            },
            attributes: ['id', 'studentnumber', 'name'],
            include: {
              model: TaskResponse,
              attributes: ['task_id', 'points']
            }
          },
          {
            separate: true,
            model: CategoryResponse,
            attributes: ['grade_id', 'response_id', 'text', 'category_question_id'],
          },
          {
            separate: true,
            model: OpenResponse,
            attributes: ['response_id', 'text', 'open_question_id']
          },
          {
            model: FinalGradeResponse,
            required: false,
            attributes: ['grade_id', 'text']
          }
        ]
      }),
      feedbackSelfAssessmentForm(id, lang)
    ])
    return [
      response.toJSON(),
      selfAssessmentForm.toJSON()
    ]
  },
  value: (response, selfAssessmentForm) => {
    if (selfAssessmentForm.type === 'OBJECTIVES') {
      return {
        id: response.person.id,
        studentnumber: response.person.studentnumber,
        name: response.person.name
      }
    }
    const parsedSelfAssessmentForm = feedbackParseSelfAssessmentForm(selfAssessmentForm)

    const parsedStudent = feedbackParseStudent(parsedSelfAssessmentForm)(response)

    const { parsedCategories, parsedSkillLevels, parsedGrades } = parsedSelfAssessmentForm

    const result = {
      id: parsedStudent.id,
      studentnumber: parsedStudent.studentnumber,
      name: parsedStudent.name,
      categories: parsedCategories.map(category => ({
        id: category.id,
        name: category.name,
        responseGrade: parsedStudent.responseGrades[category.id],
        feedbackGrade: getBestGrade(category, parsedSkillLevels, parsedStudent.taskResponses),
        progress: getCategoryProgress(category, parsedSkillLevels, parsedStudent.taskResponses)
      })),
      openResponses: parsedStudent.openResponses,
      finalGrade: (
        parsedStudent.finalGradeResponse
          ? {
            responseGrade: parsedStudent.finalGradeResponse,
            feedbackGrade: getFinalGrade(parsedSkillLevels, parsedStudent.taskResponses, parsedGrades),
            progress: getFinalGradeProgress(parsedSkillLevels, parsedStudent.taskResponses, parsedGrades)
          }
          : null
      )
    }

    return result
  }
}

const progressMapper = levelCompletions => (grade) => {
  const level = levelCompletions[grade.skillLevelId]
  const denominator = level.maxPoints * grade.neededForGrade
  const progress = (
    denominator === 0
      ? 1
      : Math.min(Math.floor(100 * level.points / denominator) / 100, 1)
  )
  return {
    id: grade.id,
    progress
  }
}

const getCategoryProgress = (category, skillLevels, taskResponses) => {
  const levelCompletions = skillLevels.reduce(
    (acc, level) => ({
      ...acc,
      [level.id]: {
        maxPoints: level.categories[category.id].maxPoints,
        points: level.categories[category.id].taskObjectives.reduce(
          (acc2, taskObjective) => acc2 + (
            taskObjective.multiplier * (
              taskResponses[taskObjective.task_id] || 0
            )
          ),
          0
        )
      }
    }),
    {}
  )
  return category.grades.map(progressMapper(levelCompletions))
}

const getFinalGradeProgress = (skillLevels, taskResponses, grades) => {
  const levelCompletions = skillLevels.reduce(
    (acc, level) => ({
      ...acc,
      [level.id]: {
        maxPoints: Object.values(level.categories).reduce(
          (acc2, category) => acc2 + category.maxPoints,
          0
        ),
        points: Object.values(level.categories).reduce(
          (acc2, category) => acc2 + (
            category.taskObjectives.reduce(
              (acc3, taskObjective) => acc3 + (
                taskObjective.multiplier * (
                  taskResponses[taskObjective.task_id] || 0
                )
              ),
              0
            )
          ),
          0
        )
      }
    }),
    {}
  )
  return grades.map(progressMapper(levelCompletions))
}

const getByCourse = async (id, user) => {
  const [selfAssessmentForms, coursePerson] = await Promise.all([
    SelfAssessmentForm.findAll({
      where: {
        course_instance_id: id
      },
      attributes: {
        exclude: ['created_at', 'updated_at']
      }
    }),
    CoursePerson.findOne({
      where: {
        course_instance_id: id,
        person_id: user.id
      },
      attributes: ['role']
    })
  ])
  if (!coursePerson || coursePerson.role !== 'TEACHER') {
    return selfAssessmentForms.filter(selfAssessmentForm => selfAssessmentForm.active)
  }
  return selfAssessmentForms
}

module.exports = {
  create,
  delete: deleteService,
  getOne,
  getData,
  edit,
  feedback,
  individualFeedback,
  getByCourse
}
