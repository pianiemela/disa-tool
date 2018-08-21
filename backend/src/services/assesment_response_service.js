const { AssessmentResponse, Person, SelfAssessment } = require('../database/models')

const getOne = async (user, selfAssesmentId) => AssessmentResponse.find({
  where: { person_id: user.id, self_assessment_id: selfAssesmentId }
})

const create = async (user, selfAssesmentId, data) => AssessmentResponse.find({
  where: { person_id: user.id, self_assessment_id: selfAssesmentId }
}).then((found) => {
  if (!found) {
    return AssessmentResponse.create({
      response: data, self_assessment_id: selfAssesmentId, person_id: user.id
    })
  }
  throw Error('Olet jo vastannut tähän itsearvioon!')
})

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
  getBySelfAssesment
}
