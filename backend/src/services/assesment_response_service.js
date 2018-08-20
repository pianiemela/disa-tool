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
          course_instance_id: id
        },
        attributes: ['id', 'course_instance_id']
      }
    ]
  })
  return responses.map((response) => {
    const json = response.toJSON()
    return {
      id: json.id,
      person: json.person,
      response: json.response
    }
  })
}

module.exports = {
  getOne,
  create,
  getBySelfAssesment
}
