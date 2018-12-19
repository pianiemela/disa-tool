const router = require('express').Router()
const logger = require('../utils/logger')
const { errors } = require('../messages/global.js')
const { checkPrivilege } = require('../services/privilege')

const { checkAuth } = require('../services/auth.js')

const selfAssesmentService = require('../services/self_assesment_service.js')

router.post('/create', async (req, res) => {
  try {
    let formData = req.body
    const { formInfo } = formData.structure
    const hasPrivilege = await checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: formData.course_instance_id
      }
    ])

    if (!hasPrivilege) {
      res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }

    formData = destructureNamesAndInstructions(formData, formInfo)
    const data = await selfAssesmentService.addSelfAssesment(formData, req.lang)

    res.status(200).json({
      message: 'Self assessment created succesfully!',
      data
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({
        error
      })
    } else {
      res.status(500).json({
        error: errors.unexpected[req.lanq]
      })
    }
  }
})

router.get('/:selfAssesmentId', async (req, res) => {
  try {
    const { selfAssesmentId } = req.params
    const data = await selfAssesmentService.getOne(selfAssesmentId, req.lang)

    return res.status(200).json({
      data
    })
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({
        error
      })
    } else {
      res.status(500).json({
        error: errors.unexpected[req.lang]
      })
      logger.error(error)
    }
  }
  return null
})

router.get('/', async (req, res) => {
  const user = await checkAuth(req)
  const data = await selfAssesmentService.getUserSelfAssesments(user, req.lang)
  return res.status(200).json({
    data
  })
})

router.put('/update/:id', async (req, res) => {
  try {
    let data = req.body
    checkAuth(req)
    const hasPrivilege = await checkPrivilege(req, [
      { key: 'teacher_on_course', param: data.course_instance_id }
    ])
    if (!hasPrivilege) {
      res.status(403).json({
        error: errors.unexpected[req.lang]
      })
      return
    }
    const { formInfo } = data.structure
    data = destructureNamesAndInstructions(data, formInfo)
    data = await selfAssesmentService.updateSelfAssesment(data, req.lang)
    res.status(200).json({
      message: 'Self assessment updated succesfully',
      data
    })
  } catch (error) {
    logger.error(error)
    res.status(500).json({
      error: errors.unexpected[req.lang]
    })
  }
})

router.put('/toggle/:id', async (req, res) => {
  const { id } = req.params
  const { attribute } = req.body
  const assessment = await selfAssesmentService.toggleAssessment(id, attribute)
  return res.status(200).json({
    message: `Self assessment property ${attribute} is now ${assessment[attribute] ? 'enabled' : 'disabled'}`,
    assessment
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
