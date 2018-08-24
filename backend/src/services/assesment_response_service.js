const {
  AssessmentResponse,
  Category,
  Grade,
  Objective,
  Person,
  SelfAssessment,
  Task,
  SkillLevel,
  TaskResponse
} = require('../database/models')
const gradeService = require('../services/grade_service')

const getOne = async (user, selfAssesmentId, lang) => {
  const found = await AssessmentResponse.find({
    where: { person_id: user.id, self_assessment_id: selfAssesmentId }
  })
  if (!found) {
    return found
  }
  const filteredResponse = await getGradesAndHeader(found.get({ plain: true }), lang)
  const assesmentResponse = found.get({ plain: true })
  assesmentResponse.response = filteredResponse
  return assesmentResponse

}

const create = async (user, selfAssesmentId, data) => AssessmentResponse.find({
  where: { person_id: user.id, self_assessment_id: selfAssesmentId }
}).then((found) => {
  if (!found) {
    /* Swap the final grade category headers to final grade 'main' header
      (from 'Anna itsellesi arvosana kurssista' => 'Loppuarvosana' etc)
     and remove the redundant category header
    */
    const filteredData = { ...data }
    filteredData.finalGradeResponse.headers = swapHeaders(filteredData)
    delete filteredData.finalHeaders

    // TODO: NOTE THAT THIS NOW ONLY BUILDS! NEED TO SAVE SEPARATELY!
    return AssessmentResponse.build({
      response: filteredData, self_assessment_id: selfAssesmentId, person_id: user.id
    })
  }
  throw Error('Olet jo vastannut tähän itsearvioon!')
})

const verifyAssessmentGrade = async (response) => {
  const grades = await Grade.findAll({
    include: { model: SkillLevel, where: { course_instance_id: response.response.course_instance_id } }
  })
  const userTasks = await TaskResponse.findAll({ where: { person_id: response.person_id } })
  // go through each question field
  const earnedGrades = await Promise.all(response.response.questionModuleResponses.map(async (resp) => {
    // find the grade user wants
    const wantedGrade = grades.find(grade => grade.id === resp.grade)
    // find current category, include objectives and tasks
    const category = await Category.find({
      where: { id: resp.id },
      include: { model: Objective, include: Task }
    })

    // Check what grades meet requirements
    const gradeQualifies = await Promise.all(grades.map(async (grade) => {
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
      return {
        grade: grade.id,
        userPoints,
        maxPoints,
        // user is qualified for grade if the points exceed the needed level
        qualifiedForGrade: userPoints / maxPoints >= grade.needed_for_grade,
        prerequisite: grade.prerequisite,
        skillLevel: grade.skill_level_id,
        needed: grade.needed_for_grade
      }
    }))

    // If any prerequisite is not met, user does not earn the grade,
    // even if points otherwise would be enough
    gradeQualifies.map((grade) => {
      let preReq = grade.prerequisite || undefined
      let depth = 0
      while (preReq !== undefined) {
        depth += 1
        const found = gradeQualifies.find(g => g.grade === preReq) // eslint-disable-line no-loop-func

        if (found && !found.qualifiedForGrade) {
          grade.qualifiedForGrade = false
        }
        preReq = found.prerequisite || undefined
      }
      grade.depth = depth
    })

    // Find the highest grade earned. This is the grade with biggest recursive depth,
    // i.e. most levels of prerequisites
    let earnedGrade = gradeQualifies[0]
    for (let i = 1; i < gradeQualifies.length; i += 1) {
      const grade = gradeQualifies[i]
      if (grade.qualifiedForGrade && grade.depth >= earnedGrade.depth) {
        earnedGrade = grade
      }
    }
    return { gradeQualifies, earnedGradeId: earnedGrade.grade, wantedGradeId: wantedGrade.id, categoryId: category.id }
  }))

  return earnedGrades
}

const generateFeedback = (response) => {
  const { verification } = response.response
  console.log(verification)
  return 'hello'
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

const swapHeaders = (data) => {
  const h = {}
  data.finalHeaders.forEach(finalH => h[finalH.type] = finalH.value) // eslint-disable-line
  return h
}

const getGradesAndHeader = async (data, lang) => {
  const { response } = data

  // get the grades and map all grades from ids to values

  const grades = await gradeService.getByCourse(response.course_instance_id, lang)
  response.questionModuleResponses = response.questionModuleResponses.map(qmRes => ({ ...qmRes, grade: grades.find(g => g.id === qmRes.grade).name }))
  const { grade } = response.finalGradeResponse

  // if we dont have a grade value for final grade, it didnt exist in the assessment so we can just return

  if (!grade) {
    return response
  }

  // ...else we get the correct header name by lang and change the final grade from id to value

  response.finalGradeResponse = { ...response.finalGradeResponse, grade: grades.find(g => g.id === grade).name }
  response.finalGradeResponse.name = data.response.finalGradeResponse.headers[`${lang}_name`]
  return response
}
