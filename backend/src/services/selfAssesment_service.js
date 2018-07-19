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
  const created = await SelfAssessment.create(data)
  const createWithLanAndInst = await SelfAssessment.findOne({
    attributes: ['id', name, instructions, 'structure', 'open', 'active', 'immediate_feedback', 'course_instance_id'],
    where: { id: created.id }
  })

  return createWithLanAndInst
}

const getUserSelfAssesments = async (user, lang) => {
  const name = [`${lang}_name`, 'name']
  const instructions = [`${lang}_instructions`, 'instructions']



  // const selfAssesments = await Person.findOne({
  //   where: {
  //     id: user.id
  //   },
  //   include: [
  //     {
  //       model: CourseInstance,
  //       through: {},
  //       include: [
  //         {
  //           model: SelfAssessment
  //         }
  //       ]
  //     }
  //   ]
  // })

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

const getAssesmentsForCourse = (courseId, lang, userId) => (
  SelfAssessment.findAll({
    where: { course_instance_id: courseId },
    attributes: assessmentAttributes(lang),
    include: { model: AssessmentResponse, where: { person_id: userId }, required: false } })
)


module.exports = {
  addSelfAssesment,
  getUserSelfAssesments,
  getAssesmentsForCourse
}