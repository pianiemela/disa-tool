const {
  SelfAssessment,
  AssessmentResponse,
  CourseInstance,
  Person
} = require('../database/models.js')

const categoryService = require('../services/category_service')
const courseInstanceService = require('../services/course_instance_service')

const assessmentAttributes = lang => [
  'id',
  [`${lang}_name`, 'name'],
  [`${lang}_instructions`, 'instructions'],
  'structure',
  'open',
  'active',
  'show_feedback',
  'course_instance_id']

const addSelfAssesment = async (data, lang) => {
  const name = [`${lang}_name`, 'name']
  const instructions = [`${lang}_instructions`, 'instructions']
  const created = await SelfAssessment.create(data).then(createdSA => SelfAssessment.findById(createdSA.id, {
    attributes: ['id', name, instructions, 'structure', 'open', 'active', 'show_feedback', 'course_instance_id']
  }))

  return created
}

const getUserSelfAssesments = async (user, lang) => {
  const name = [`${lang}_name`, 'name']
  const instructions = [`${lang}_instructions`, 'instructions']

  const data = await SelfAssessment.findAll({
    attributes: ['id', name, instructions, 'structure', 'open', 'active', 'show_feedback', 'course_instance_id'],
    include: [
      {
        model: CourseInstance,
        required: true,
        attributes: ['id'],
        include: [
          {
            model: Person,
            required: true,
            attributes: [],
            where: {
              id: user.id
            }
          }
        ]
      }
    ]
  })

  return data
}

const updateSelfAssesment = async (data, lang) => {
  await SelfAssessment.update(
    {
      fin_name: data.fin_name,
      swe_name: data.swe_name,
      eng_name: data.eng_name,
      fin_instructions: data.fin_instructions,
      eng_instructions: data.swe_instructions,
      swe_instructions: data.eng_instructions,
      structure: data.structure,
      open: data.open,
      active: data.active,
      show_feedback: data.show_feedback
    },
    {
      where: { id: data.id }
    }
  )
  const updated = await SelfAssessment.findById(data.id, {
    attributes:
      assessmentAttributes(lang)
  })
  return updated
}

const getAssesmentsForCourse = (courseId, lang, userId) => (
  SelfAssessment.findAll({
    where: { course_instance_id: courseId },
    attributes: assessmentAttributes(lang),
    include: { model: AssessmentResponse, where: { person_id: userId }, required: false }
  })
)

const getOne = async (selfAssesmentId, lang) => {
  const assessment = await SelfAssessment.findOne({
    where: { id: selfAssesmentId }
  })

  const assessmentValues = assessment.get({ plain: true })
  return setAssessmentLanguage(assessmentValues, lang)
}

const toggleAssessment = async (id, attribute) => {
  const assessment = await SelfAssessment.findById(id)
  assessment[attribute] = !assessment[attribute]
  return assessment.save({ returning: true })
}

const isFeedbackActive = async (id) => {
  const assessment = await SelfAssessment.findById(id)
  return assessment.show_feedback
}

const setAssessmentLanguage = async (selfAssessment, lang) => {
  const assessmentCopy = { ...selfAssessment }
  const { structure } = assessmentCopy
  const { course_instance_id } = assessmentCopy //eslint-disable-line
  const { type } = structure
  const name = `${lang}_name`
  const instructions = `${lang}_instructions`

  assessmentCopy.name = assessmentCopy[name]
  const oldInst = structure.formInfo.find(h => h.type === instructions)
  assessmentCopy.instructions = { header: oldInst.header, value: oldInst.value }

  structure.finalGrade.name = (structure.finalGrade.headers.find(h => h.type === name)).value
  structure.openQuestions.name = (structure.headers.openQ.find(h => h.type === name)).value
  structure.questionModuleName = (structure.headers.questionHeaders.find(h => h.type === name)).value
  structure.finalGrade = {
    ...structure.finalGrade,
    header: structure.headers.grade.find(h => h.type === name).value,
    value: structure.finalGrade.headers.find(h => h.type === name).value
  }

  const categories = (await categoryService.getCourseCategories(course_instance_id, lang)).map(category => category.get({ plain: true }))
  structure.displayCoursename = ((await courseInstanceService.getOne(course_instance_id)).get({ plain: true }))[name]
  const categoryNames = {}
  const objNames = {}

  categories.forEach(cat => (categoryNames[cat.id] = cat.name)) //eslint-disable-line
  categories.forEach(cat => cat.objectives.forEach(o => objNames[o.id] = o.name))  //eslint-disable-line
  structure.openQuestions.questions = structure.openQuestions.questions.map(openQ => ({ ...openQ, name: openQ[name] }))

  if (type === 'category') {
    structure.questionModules = structure.questionModules.map(
      qMod => ({
        ...qMod, name: categoryNames[qMod.id.toString()]
      }))

    return assessmentCopy
  }

  structure.questionModules = assessmentCopy.structure.questionModules.map(qMod => ({
    ...qMod,
    name: categoryNames[qMod.id.toString()],
    objectives: qMod.objectives.map(categoryOb => (
      { ...categoryOb, name: objNames[categoryOb.id] }
    ))
  }))

  assessmentCopy.structure = structure
  return assessmentCopy
}


module.exports = {
  addSelfAssesment,
  getUserSelfAssesments,
  getAssesmentsForCourse,
  updateSelfAssesment,
  getOne,
  toggleAssessment,
  isFeedbackActive
}
