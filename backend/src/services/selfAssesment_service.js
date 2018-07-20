const {
  SelfAssessment,
  AssessmentResponse,
  Person,
  CoursePerson,
  CourseInstance } = require('../database/models.js')

const assessmentAttributes = lang => [
  'id',
  [`${lang}_name`, 'name'],
  [`${lang}_instructions`, 'instructions'],
  'structure',
  'open',
  'active',
  'immediate_feedback',
  'course_instance_id']

const addSelfAssesment = async (data, lang) => {
  const name = [`${lang}_name`, 'name']
  const instructions = [`${lang}_instructions`, 'instructions']
  const created = await SelfAssessment.create(data).then(created =>
    SelfAssessment.findOne({
      attributes: ['id', name, instructions, 'structure', 'open', 'active', 'immediate_feedback', 'course_instance_id'],
      where: { id: created.id }
    }))

  return created
}

const getUserSelfAssesments = async (user, lang) => {
  const name = [`${lang}_name`, 'name']
  const instructions = [`${lang}_instructions`, 'instructions']

  const data = await SelfAssessment.findAll({
    attributes: ['id', name, instructions, 'structure', 'open', 'active', 'immediate_feedback', 'course_instance_id'],
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
  const name = [`${lang}_name`, 'name']
  const instructions = [`${lang}_instructions`, 'instructions']
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
      immediate_feedback: data.immediate_feedback
    },
    {
      where: { id: data.id }
    }
  )
  const updated = await SelfAssessment.findById(data.id, {
    attributes:
      ['id',
        name,
        instructions,
        'structure',
        'open',
        'active',
        'immediate_feedback',
        'course_instance_id'
      ]
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


module.exports = {
  addSelfAssesment,
  getUserSelfAssesments,
  getAssesmentsForCourse,
  updateSelfAssesment
}
