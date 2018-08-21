const { AssessmentResponse, Category, Grade, Objective, Task, SkillLevel, TaskResponse } = require('../database/models')

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

    // Find grades with no pre-requisites
    const startGrades = grades.filter(grade => !grade.prerequisite)
    startGrades.map(async (grade) => {
      const gradeObjectives = await Objective.findAll({
        where: {
          skill_level_id: grade.skill_level_id, course_instance_id: response.response.course_instance_id
        },
        include: Task
      })
      gradeObjectives.map(async (objective) => {
        // filter out tasks with no responses
        const filteredTasks = objective.tasks.filter(task => TaskResponse.count({ where: { task_id: task.id } }))
        let maxPoints = 0
        let userPoints = 0
        filteredTasks.forEach(task => {
          maxPoints += task.max_points * task.task_objective.multiplier
          userPoints += userTasks.find(ut => ut.task_id === task.id).points * task.task_objective.multiplier || 0
        })
        console.log(maxPoints, userPoints)
      }
    })
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

module.exports = {
  getOne,
  create,
  generateFeedback
}
