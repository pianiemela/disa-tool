const router = require('express').Router()

const { checkAuth } = require('../services/auth.js')

const selfAssesmentService = require('../services/selfAssesment_service.js')

router.post('/create', async (req, res) => {
  let createFormData = req.body
  const { formInfo } = req.body
  createFormData = destructureNamesAndInstructions(createFormData, formInfo)
  createFormData.structure = JSON.stringify(createFormData.structure)
  const data = await selfAssesmentService.addSelfAssesment(createFormData)
  data.structure = JSON.parse(data.structure)

  return res.status(200).json({
    message: 'it is done my friend',
    data
  })
})

router.get('/', async (req, res) => {
  const user = await checkAuth(req)
  let userSelfAssesments = await selfAssesmentService.getUserSelfAssesments(user)
  userSelfAssesments.forEach((uSA) => {
    const parsedStructure = uSA
    parsedStructure.structure = JSON.parse(uSA.structure)
    return parsedStructure
  })
  return res.status(200).json({
    userSelfAssesments
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
