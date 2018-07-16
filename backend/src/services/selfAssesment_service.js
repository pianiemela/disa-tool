const { SelfAssessment } = require('../database/models.js')

const addSelfAssesment = async (data) => {
  const created = await SelfAssessment.create(data)
  return created
}


module.exports = {
  addSelfAssesment
}