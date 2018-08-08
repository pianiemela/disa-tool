const { AssessmentResponse } = require('../database/models')

const getOne = async (user, selfAssesmentId) => AssessmentResponse.find({
  where: { person_id: user.id, self_assessment_id: selfAssesmentId }
}).then((found) => {
  if (found) {
    return found
  }
  return AssessmentResponse.create({ person_id: user.id, self_assessment_id: selfAssesmentId })
})

const createOrUpdate = async (user, selfAssesmentId, data) => AssessmentResponse.find({
  where: { person_id: user.id, self_assessment_id: selfAssesmentId }
}).then((found) => {
  if (!found) {
    return AssessmentResponse.create({
      response: data, self_assessment_id: selfAssesmentId, person_id: user.id
    })
  }
  return AssessmentResponse.update({ response: data },
    {
      where: {
        id: found.id
      }
    }
  ).then(() => AssessmentResponse.find({
    where: { id: found.id }
  })
  )
})

module.exports = {
  getOne,
  createOrUpdate
}
