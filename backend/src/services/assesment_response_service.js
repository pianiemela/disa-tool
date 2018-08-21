const { AssessmentResponse, Category, Grade, Objective, Person, SelfAssessment, Task, SkillLevel, TaskResponse } = require('../database/models')

const getOne = async (user, selfAssesmentId) => AssessmentResponse.find({
  where: { person_id: user.id, self_assessment_id: selfAssesmentId }
})

const create = async (user, selfAssesmentId, data) => AssessmentResponse.find({
  where: { person_id: user.id, self_assessment_id: selfAssesmentId }
}).then((found) => {
  if (!found) {
    return AssessmentResponse.build({
      response: data, self_assessment_id: selfAssesmentId, person_id: user.id
    })
  }
  throw Error('Olet jo vastannut tähän itsearvioon!')
})

const generateFeedback = async (response) => {
  const grades = await Grade.findAll({
    include: { model: SkillLevel, where: { course_instance_id: response.response.course_instance_id } }
  })
  const userTasks = await TaskResponse.findAll({ where: { person_id: response.person_id } })
  // go through each question field
  response.response.questionModuleResponses.map(async (resp) => {
    // find the grade user wants
    const wantedGrade = grades.find(grade => grade.id === resp.grade)
    // find current category, include objectives and tasks
    const category = await Category.find({
      where: { fin_name: resp.name },
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
      const userPoints = objectivePoints.reduce((acc, curr) => acc + curr.userPoints, 0)
      const maxPoints = objectivePoints.reduce((acc, curr) => acc + curr.maxPoints, 0)
      return {
        grade: grade.id,
        userPoints,
        maxPoints,
        qualifiedForGrade: userPoints / maxPoints >= grade.needed_for_grade,
        prerequisite: grade.prerequisite
      }
    }))

    gradeQualifies.map((grade) => {
      let preReq = grade.prerequisite || undefined
      let depth = 0
      while (preReq !== undefined) {
        depth += 1
        const found = gradeQualifies.find(g => g.grade === preReq) // eslint-disable-line

        if (found && !found.qualifiedForGrade) {
          grade.qualifiedForGrade = false
        }
        preReq = found.prerequisite || undefined
      }
      grade.depth = depth
    })

    console.log(gradeQualifies)
    /*
    // Check grade pre-requisite,
    // until there is none, and then start going through the tasks?
    const preReqGrades = []
    let preReqGrade = wantedGrade.prerequisite || undefined
    while (preReqGrade !== undefined) {
      const newGrade = grades.find(grade => grade.id === preReqGrade)
      preReqGrades.push(newGrade)
      preReqGrade = newGrade.prerequisite || undefined
    }
    // now all prerequisites are neatly in a list. Now start popping through the list, until there are
    // no grades left.
    while (preReqGrades.length > 0) {
      const curGrade = preReqGrades.pop()
      // find all objectives that match the current grade's skill level. Include Tasks.
      // We also need taskObjectives, since they have the multipliers.
      const gradeObjectives = await Objective.findAll({  // eslint-disable-line
        where: {
          skill_level_id: curGrade.skill_level_id, course_instance_id: response.response.course_instance_id
        },
        include: Task
      })

      gradeObjectives.map(obj => obj.tasks.map(task => console.log(task.task_objective)))
    }
    const feedbackForSkillLevels = [{ id: 1, donePoints: {}, maxPoints: 10 }]
    const categoryFeedback = [{
      categoryId: 1,
      skillLevels: [{
        id: 1,
        donePoints: {},
        maxPoints: 10
      }],
      wantedGrade: 4,
      validatedGrade: 3
    }]
    */
    // For each popped grade, check if user's responses meet the requirement and make a note of it.
    // If responses do not meet requirement, save a note of that, but continue still.
    // After all is done, need to check any higher skill levels for possible "bonus" response points.
  })
  // console.log('NEEDED GRADES', preReqGrades)
  // console.log(response.response.questionModuleResponses.map(resp => console.log(resp)))
  // console.log(response)
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
    const json = response.toJSON()
    return {
      id: json.id,
      person: json.person,
      response: JSON.parse(json.response)
    }
  })
  return { data, courseInstanceId }
}

module.exports = {
  getOne,
  create,
  generateFeedback,
  getBySelfAssesment
}
