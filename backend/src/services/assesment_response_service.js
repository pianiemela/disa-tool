const {
  AssessmentResponse,
  Category,
  CategoryGrade,
  Grade,
  Objective,
  Person,
  SelfAssessment,
  Task,
  SkillLevel,
  TaskResponse
} = require('../database/models')

const getOne = async (user, selfAssesmentId) => AssessmentResponse.find({
  where: { person_id: user.id, self_assessment_id: selfAssesmentId }
})

const create = async (user, selfAssesmentId, data) => AssessmentResponse.find({
  where: { person_id: user.id, self_assessment_id: selfAssesmentId }
}).then((found) => {
  if (!found) {
    // TODO: NOTE THAT THIS NOW ONLY BUILDS! NEED TO SAVE SEPARATELY!
    return AssessmentResponse.build({
      response: data, self_assessment_id: selfAssesmentId, person_id: user.id
    })
  }
  throw Error('Olet jo vastannut tähän itsearvioon!')
})

const verifyAssessmentGrade = async (response, lang) => {
  const courseGrades = await Grade.findAll({
    include: [
      { model: SkillLevel, where: { course_instance_id: response.response.course_instance_id } },
      CategoryGrade
    ]
  })
  const categories = await Category.findAll({
    where: { course_instance_id: response.response.course_instance_id },
    include: CategoryGrade
  })
  const userTasks = await TaskResponse.findAll({ where: { person_id: response.person_id } })
  // go through each question field
  const earnedGrades = await Promise.all(response.response.questionModuleResponses.map(async (categoryResp) => {
    const categoryGrades = categories.find(category => category.id === categoryResp.id).category_grades
    // find the grade user wants
    const wantedGrade = {
      id: categoryGrades.find(grade => grade.grade_id === categoryResp.grade).id,
      name: courseGrades.find(grade => grade.id === categoryResp.grade)[`${lang}_name`]
    }
    // find current category, include objectives and tasks
    const category = await Category.find({
      where: { id: categoryResp.id },
      include: { model: Objective, include: Task }
    })

    // Check what grades meet requirements
    const gradeQualifies = await Promise.all(courseGrades.map(async (grade) => {
      const gradeObjectives = await Objective.findAll({
        where: {
          skill_level_id: grade.skill_level_id,
          course_instance_id: response.response.course_instance_id,
          category_id: category.id
        },
        include: Task
      })
      // Get point sums for all objectives.
      const objectivePoints = await Promise.all(gradeObjectives.map(async (objective) => {
        // filter out tasks with no responses
        const filteredTasks = objective.tasks.filter(task => TaskResponse.count({ where: { task_id: task.id } }))
        let maxPoints = 0
        let userPoints = 0
        // calculate users points and the maximum for the objective
        filteredTasks.forEach((task) => {
          maxPoints += task.max_points * task.task_objective.multiplier
          const doneTask = userTasks.find(ut => ut.task_id === task.id)
          userPoints += doneTask ? doneTask.points * task.task_objective.multiplier : 0
        })
        return { userPoints, maxPoints }
      }))
      // calculate sums over objectives
      const userPoints = objectivePoints.reduce((acc, curr) => acc + curr.userPoints, 0)
      const maxPoints = objectivePoints.reduce((acc, curr) => acc + curr.maxPoints, 0)
      // Get the right category grade for the correct pass level
      const categoryGrade = categoryGrades.find(cg => cg.grade_id === grade.id)
      return {
        categoryGradeId: categoryGrade.id,
        gradeId: grade.id,
        userPoints,
        maxPoints,
        // user is qualified for grade if the points exceed the needed level
        qualifiedForGrade: userPoints / maxPoints >= grade.needed_for_grade,
        prerequisiteId: grade.prerequisite,
        skillLevelId: grade.skill_level_id,
        skillLevelName: grade.skill_level[`${lang}_name`],
        needed: categoryGrade.needed_for_grade
      }
    }))

    // If any prerequisite is not met, user does not earn the grade,
    // even if points otherwise would be enough
    gradeQualifies.map((grade) => {
      let preReq = grade.prerequisiteId || undefined
      let depth = 0
      while (preReq !== undefined) {
        depth += 1
        const found = gradeQualifies.find(g => g.gradeId === preReq) // eslint-disable-line no-loop-func

        if (found && !found.qualifiedForGrade) {
          grade.qualifiedForGrade = false
        }
        preReq = found.prerequisiteId || undefined
      }
      grade.depth = depth
    })

    // Find the highest grade earned. This is the grade with biggest recursive depth,
    // i.e. most levels of prerequisites
    let earnedGrade = { gradeId: null, depth: -1 }
    for (let i = 0; i < gradeQualifies.length; i += 1) {
      const grade = gradeQualifies[i]
      if (grade.qualifiedForGrade && grade.depth >= earnedGrade.depth) {
        earnedGrade = grade
      }
    }
    const gradeForName = courseGrades.find(grade => grade.id === earnedGrade.gradeId)
    earnedGrade.name = gradeForName ? gradeForName[`${lang}_name`] : null
    return { gradeQualifies, earnedGrade, wantedGrade, categoryId: category.id, categoryName: category.name }
  }))

  return { categoryVerifications: earnedGrades, overallVerification: {} }
}

const generateFeedback = (response, lang) => {
  const { categoryVerifications } = response.response.verification
  const feedbacks = categoryVerifications.map((category) => {
    const { categoryId, earnedGrade, wantedGrade } = category
    if (category.maxPoints === 0) { // no feedback for categories with no tasks
      return { categoryId }
    }
    const earnedStats = category.gradeQualifies.find(grade => grade.gradeId === earnedGrade.gradeId) || { skillLevelId: 0 }
    const higherLevelTasksDone = category.gradeQualifies.filter(grade => (
      !grade.qualifiedForGrade
      && grade.skillLevelId !== earnedStats.skillLevelId
      && grade.userPoints > 0
      && category.gradeQualifies.find(g => grade.skillLevelId === g.skillLevelId) === grade // filter out any duplicate stats for same skill level
    ))
    const earnedPercentage = (earnedStats.userPoints / earnedStats.maxPoints * 100).toFixed(2) || null
    const extraDone = higherLevelTasksDone.map(level => (
      { skillLevel: level.skillLevelName, done: (level.userPoints / level.maxPoints * 100).toFixed(2) }
    ))
    const text = `Annoit itsellesi arvosanan ${wantedGrade.name},
    mutta tehtyjen tehtävien perusteella arvosanasi olisi ${earnedGrade.name},
    koska olet tehnyt ${earnedPercentage} % tämän tason tehtävistä.
    Olet kuitenkin tehnyt tehtäviä korkeammilta tasoilta:
    ${extraDone.map(extra => ` ${extra.skillLevel}: ${extra.done} %`)},
    joten on mahdollista, että osaat osion tavoitteet ilmoittamallasi tasolla.
    On kuitenkin tärkeää hallita perusteet huolella ennen siirtymistä vaikeampiin
    tehtäviin ja siksi olisi tärkeää tehdä myös alemman tason tehtäviä huolellisesti.`
    return { categoryId, text }
  })
  return feedbacks
}

const getCourseInstanceId = async (id) => {
  const selfAssessment = await SelfAssessment.findById(id, {
    attributes: ['id', 'course_instance_id']
  })
  if (!selfAssessment) return null
  return selfAssessment.get({ plain: true }).course_instance_id
}

const getBySelfAssesment = async (id) => {
  const responses = await AssessmentResponse.findAll({
    attributes: ['id', 'response', 'person_id', 'self_assessment_id'],
    include: [
      {
        model: Person,
        attributes: ['id', 'name']
      },
      {
        model: SelfAssessment,
        where: {
          id
        },
        attributes: ['id', 'course_instance_id']
      }
    ]
  })
  const courseInstanceId = responses.length > 0 ? (
    responses[0].dataValues.self_assessment.course_instance_id
  ) : (
    await getCourseInstanceId(id)
  )
  const data = responses.map((response) => {
    return {
      id: response.id,
      person: response.person,
      response: response.response
    }
  })
  return { data, courseInstanceId }
}

module.exports = {
  getOne,
  create,
  generateFeedback,
  verifyAssessmentGrade,
  getBySelfAssesment
}
