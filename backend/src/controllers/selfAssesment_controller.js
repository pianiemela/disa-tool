const router = require('express').Router()

const { checkAuth } = require('../services/auth.js')

const selfAssesmentService = require('../services/selfAssesment_service.js')

router.post('/create', async (req, res) => {
  let createFormData = req.body
  const { formInfo } = req.body
  createFormData = destructureNamesAndInstructions(createFormData, formInfo)

  createFormData.structure = JSON.stringify(createFormData.structure)
  const created = await selfAssesmentService.addSelfAssesment(createFormData)
  
  return res.status(200).json({
    message: 'it is done my friend',
    created
  })
})

const destructureNamesAndInstructions = (createFormData, formInfo) => {
  const withNamesAndInstructions = createFormData
  formInfo.forEach((forminfoType) => {
    withNamesAndInstructions[forminfoType.type] = forminfoType.value
  })
  return withNamesAndInstructions
}

module.exports = router
