const { AssessmentResponse } = require('../database/models')

const getOne = async (user, selfAssesmentId) => AssessmentResponse.find({
  where: { person_id: user.id, self_assessment_id: selfAssesmentId }
}).then((found) => {
  if (found) {
    return found
  }
  return AssessmentResponse.create({ response: '{}', person_id: user.id, self_assessment_id: selfAssesmentId })
})


module.exports = {
  getOne
}
