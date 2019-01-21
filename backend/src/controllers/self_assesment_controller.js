const router = require('express').Router()
const logger = require('../utils/logger')
const { errors } = require('../messages/global.js')
const { checkPrivilege } = require('../services/privilege')

const { checkAuth } = require('../services/auth.js')

const selfAssesmentService = require('../services/self_assesment_service.js')

const messages = {
  create: {
    eng: 'Self assessment created succesfully.',
    fin: 'Itsearviointi luotu onnistuneesti.',
    swe: ''
  },
  delete: {
    eng: 'Self assessment deleted succesfully.',
    fin: 'Itsearviointi poistettu onnistuneesti.',
    swe: ''
  },
  update: {
    eng: 'Self assessment updated succesfully.',
    fin: 'Itsearviointi päivitetty onnistuneesti.',
    swe: ''
  },
  toggle: {
    open: {
      true: {
        eng: 'Self assesment is now open.',
        fin: 'Itsearviointi on nyt avoin.',
        swe: ''
      },
      false: {
        eng: 'Self assesment is now closed.',
        fin: 'Itsearviointi on nyt suljettu.',
        swe: ''
      }
    },
    active: {
      true: {
        eng: 'Self assesment is now visible.',
        fin: 'Itsearviointi on nyt näkyvissä.',
        swe: ''
      },
      false: {
        eng: 'Self assesment is no longer visible.',
        fin: 'Itsearviointi ei ole enää näkyvissä.',
        swe: ''
      }
    },
    show_feedback: {
      true: {
        eng: 'Self assesment feedback is visible to students.',
        fin: 'Itseisarvioinnin palaute näkyy opiskelijoille.',
        swe: ''
      },
      false: {
        eng: 'Self assesment feedback is not visible to students.',
        fin: 'Itseisarvioinnin palaute ei näy opiskelijoille.',
        swe: ''
      }
    }
  }
}

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
      message: messages[req.lang],
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

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const toDelete = await selfAssesmentService.delete.prepare(id)
    if (!toDelete) {
      res.status(404).json({
        toast: errors.notfound.toast,
        error: errors.notfound[req.lang]
      })
      return
    }
    const hasPrivilege = await checkPrivilege(req, [
      { key: 'teacher_on_course', param: toDelete.dataValues.course_instance_id }
    ])
    if (!hasPrivilege) {
      res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }
    const deleted = selfAssesmentService.delete.value(toDelete)
    selfAssesmentService.delete.execute(toDelete)
    res.status(200).json({
      message: messages.delete[req.lang],
      deleted
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
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }
    const { formInfo } = data.structure
    data = destructureNamesAndInstructions(data, formInfo)
    data = await selfAssesmentService.updateSelfAssesment(data, req.lang)
    res.status(200).json({
      message: messages.update[req.lang],
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
  const instance = await selfAssesmentService.toggleAssessment.prepare(id, attribute)
  const assessment = instance.toJSON()
  const hasPrivilege = await checkPrivilege(req, [
    {
      key: 'teacher_on_course',
      param: assessment.course_instance_id
    }
  ])
  if (!hasPrivilege) {
    res.status(403).json({
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  selfAssesmentService.toggleAssessment.execute(instance)
  res.status(200).json({
    message: messages.toggle[attribute][String(assessment[attribute])][req.lang],
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
