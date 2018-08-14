const router = require('express').Router()
const { errors } = require('../messages/global.js')
const { checkPrivilege } = require('../services/privilege')

const { checkAuth } = require('../services/auth.js')

const selfAssesmentService = require('../services/self_assesment_service.js')

router.post('/create', async (req, res) => {
  try {
    let formData = req.body
    const { formInfo } = formData.structure
    const hasPrivilege = checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: formData.course_instance_id
      }
    ])
    if (!hasPrivilege) {
      return res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
    }

    formData = destructureNamesAndInstructions(formData, formInfo)
    formData.structure = JSON.stringify(formData.structure)
    const data = await selfAssesmentService.addSelfAssesment(formData, req.lang)
    formData.structure = JSON.parse(formData.structure)

    return res.status(200).json({
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
        error: errors.unexpected[req.lang]
      })
      console.log(error)
    }
  }
})

router.get('/:selfAssesmentId', async (req, res) => {
  try {
    const { selfAssesmentId } = req.params
    const data = await selfAssesmentService.getOne(selfAssesmentId)
    const hasPrivilege = checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: data.course_instance_id
      }
    ])
    // if (!hasPrivilege) {
    //   return res.status(403).json({
    //     toast: errors.privilege.toast,
    //     error: errors.privilege[req.lang]
    //   })
    // }
    data.structure = JSON.parse(data.structure)
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
      console.log(error)
    }
  }
  return null
})

router.get('/', async (req, res) => {
  const user = await checkAuth(req)
  const data = await selfAssesmentService.getUserSelfAssesments(user, req.lang)
  //Parse structure to JS object
  data.forEach((uSA) => {
    const parsedStructure = uSA
    parsedStructure.structure = JSON.parse(uSA.structure)
    return parsedStructure
  })
  return res.status(200).json({
    data
  })
})

router.put('/update/:id', async (req, res) => {
  let data = req.body
  const { formInfo } = data.structure
  data = destructureNamesAndInstructions(data, formInfo)
  data.structure = JSON.stringify(data.structure)
  data = await selfAssesmentService.updateSelfAssesment(data, req.lang)
  data.structure = JSON.parse(data.structure)
  return res.status(200).json({
    message: 'Self assesment updated succesfully',
    data
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
