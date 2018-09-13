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

// TODO: Heavy refactoring and testing
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
        return {
          objectiveId: objective.id,
          objectiveName: objective[`${lang}_name`],
          userPoints,
          maxPoints
        }
      }))
      // calculate sums over objectives
      const userPoints = objectivePoints.reduce((acc, curr) => acc + curr.userPoints, 0)
      const maxPoints = objectivePoints.reduce((acc, curr) => acc + curr.maxPoints, 0)
      // Get the right category grade for the correct pass level
      const categoryGrade = categoryGrades.find(cg => cg.grade_id === grade.id)
      return {
        categoryGradeId: categoryGrade.id,
        gradeId: grade.id,
        objectivePoints,
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
        // increment recursion depth by one
        depth += 1
        // find the pre-requisite in the grade list and check if user qualifies for it
        const found = gradeQualifies.find(g => g.gradeId === preReq) // eslint-disable-line no-loop-func
        if (found && !found.qualifiedForGrade) {
          grade.qualifiedForGrade = false
        }
        // go down the rabbit hole
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
    const wantedDepth = gradeQualifies.find(grade => grade.categoryGradeId === wantedGrade.id).depth
    wantedGrade.difference = wantedDepth - earnedGrade.depth
    return { gradeQualifies, earnedGrade, wantedGrade, categoryId: category.id, categoryName: category[`${lang}_name`] }
  }))

  return { categoryVerifications: earnedGrades, overallVerification: {} }
}

// TODO: Refactor. Needs possibly a separate file that contains all possible text variations.
const generateFeedback = (response, lang) => {
  const { categoryVerifications } = response.response.verification
  // generate feedback for each category
  const feedbacks = categoryVerifications.map((category) => {
    const { categoryId, categoryName, earnedGrade, wantedGrade } = category
    if (category.gradeQualifies.every(g => g.maxPoints === 0)) { // no feedback for categories with no tasks
      return { categoryId }
    }
    // Filter gradeQualifies to represent different skill levels
    const skillLevelQualifies = category.gradeQualifies.filter(grade => (
      category.gradeQualifies.find(g => grade.skillLevelId === g.skillLevelId) === grade
    ))
    const skillLevelObjectives = skillLevelQualifies.map((skillLevel) => {
      // Simply get the percentages done of the category's objectives
      const objectives = skillLevel.objectivePoints.map(objective => ({
        name: objective.objectiveName,
        percentageDone: (objective.userPoints / objective.maxPoints * 100),
        // Small safety check: if the objective has no points to be gotten, don't display it
        include: objective.maxPoints > 0
      }))
      return { skillLevel: skillLevel.skillLevelName, objectives }
    })
    const earnedStats = category.gradeQualifies.find(grade => grade.gradeId === earnedGrade.gradeId)
    || { skillLevelId: 0 }
    const higherLevelTasksDone = skillLevelQualifies.filter(grade => (
      // does user not qualify for this grade, i.e. is not the earned grade or below it
      !grade.qualifiedForGrade
      && grade.skillLevelId !== earnedStats.skillLevelId
      // does user have points for this skill level
      && grade.userPoints > 0
      // filter out any duplicate stats for same skill level
      && category.gradeQualifies.find(g => grade.skillLevelId === g.skillLevelId) === grade
    ))
    // calculate percentages that for the earned grade and higher levels that user has done
    const earnedPercentage = (earnedStats.userPoints / earnedStats.maxPoints * 100).toFixed(2) || null
    const extraDone = higherLevelTasksDone.map(level => (
      { skillLevel: level.skillLevelName, done: (level.userPoints / level.maxPoints * 100).toFixed(2) }
    ))
    // Check whether we are dealing with an accurate, humble or arrogant person
    if (wantedGrade.id === earnedGrade.categoryGradeId) {
      // Assessment spot on!
    } else if (wantedGrade.difference > 0) {
      // wants more than deserves
      // WHAT THE HELL YOU ARROGANT SHIT
    } else {
      // wants less than deserves
      // such a humble man you are
    }
    // TODO: This thing needs a complete overhaul and be more individualised
    const text = `Annoit itsellesi arvosanan ${wantedGrade.name},
    mutta tehtyjen tehtävien perusteella arvosanasi olisi ${earnedGrade.name},
    koska olet tehnyt ${earnedPercentage} % tämän tason tehtävistä.
    Olet kuitenkin tehnyt tehtäviä korkeammilta tasoilta:
    ${extraDone.map(extra => ` ${extra.skillLevel}: ${extra.done} %`)},
    joten on mahdollista, että osaat osion tavoitteet ilmoittamallasi tasolla.
    On kuitenkin tärkeää hallita perusteet huolella ennen siirtymistä vaikeampiin
    tehtäviin ja siksi olisi tärkeää tehdä myös alemman tason tehtäviä huolellisesti.`
    return { categoryId, categoryName, text, skillLevelObjectives, difference: wantedGrade.difference }
  })
  // What is the "best" category? Emphasize that first
  let best = null
  let worst = null
  let totalDone = 0
  let meanDiff = 0
  const amountsForCategory = (category) => {
    const skillLevelAmounts = category.skillLevelObjectives.map(skillLevel => (
      skillLevel.objectives.reduce((acc, cur) => acc + (cur.percentageDone / skillLevel.objectives.length), 0)
    ))
    console.log(skillLevelAmounts)
    const total = skillLevelAmounts.reduce((acc, cur) => acc + cur)
    console.log('total', total)
    return total
  }
  for (let i = 0; i < feedbacks.length; i += 1) {
    const category = feedbacks[i]
    // get the sum of done tasks
    const amountDone = amountsForCategory(category)
    totalDone += amountDone
    meanDiff += category.difference
    if (best === null || amountDone > best.amountDone) {
      best = { ...category, amountDone }
    }
    if (worst === null || amountDone < worst.amountDone) {
      worst = { ...category, amountDone }
    }
  }
  // Divide amounts to get percentages and mean
  totalDone /= feedbacks.length
  meanDiff /= feedbacks.length
  // calculate the mean absolute difference
  let madDiff = feedbacks.reduce((acc, cur) => acc + (cur.difference - meanDiff), 0)
  madDiff *= 1 / feedbacks.length
  let generalFeedback = `Olet tehnyt ${totalDone} kurssin tehtäviä.`
  if (Math.abs(meanDiff) < 1 && Math.abs(madDiff) < 1) {
    generalFeedback += 'Erittäin osuvia arvioita.'
    // very good estimate
  } else if (meanDiff <= -1 && madDiff < 0) {
    generalFeedback += 'Arvioit itseäsi yleisesti turhan ankarasti.'
    // generally under-estimating
  } else if (meanDiff >= 1 && madDiff > 0) {
    generalFeedback += 'Olit arvioissasi yleisesti liian höveli.'
    // generally over-estimating
  } else {
    generalFeedback += 'Arviosi heittelehtivät jonkin verran.'
    // estimates all over the place?
  }
  generalFeedback += ` Suhteessa eniten tehtäviä olet tehnyt osiosta ${best.categoryName}.`
  generalFeedback += ` Enemmän sinun kannattaisi ehkä panostaa osion ${worst.categoryName} tehtäviin.`
  return { generalFeedback, categoryFeedback: feedbacks }
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
  const data = responses.map(response => ({
    id: response.id,
    person: response.person,
    response: response.response
  }))
  return { data, courseInstanceId }
}


const swapHeaders = (data) => {
  const h = {}
  data.finalHeaders.forEach(finalH => h[finalH.type] = finalH.value) // eslint-disable-line
  return h
}

const getGradesAndHeader = async (data, lang) => {
  const { response } = data
  const grades = await gradeService.getByCourse(response.course_instance_id, lang)

  // get the grades and map all grades from ids to values
  if (response.assessmentType !== 'objectives') {
    response.questionModuleResponses = response.questionModuleResponses.map(
      qmRes => ({ ...qmRes, grade: grades.find(g => g.id === qmRes.grade).name })
    )
  }
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

module.exports = {
  getOne,
  create,
  generateFeedback,
  verifyAssessmentGrade,
  getBySelfAssesment
}
