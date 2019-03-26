const router = require('express').Router()
const { onlyTeacherOnCourseHasAccess } = require('../services/privilege')

const selfAssesmentFormService = require('../services/self_assesment_form_service.js')

const messages = {
  create: {
    eng: 'Self assessment created succesfully.',
    fin: 'Itsearviointi luotu onnistuneesti.',
    swe: ''
  },
  get: {
    eng: 'Self assessment inforamtion fetched succesfully.',
    fin: 'Itsearvioinnin tiedot haettu onnistuneesti.',
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
  const input = req.body
  await onlyTeacherOnCourseHasAccess(req, res, input.course_instance_id)
  let instance = await selfAssesmentFormService.create.prepare(input)
  instance = await selfAssesmentFormService.create.execute(instance)
  const value = selfAssesmentFormService.create.value(instance)
  res.status(200).json({
    message: messages.create[req.lang],
    created: value
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const instance = await selfAssesmentFormService.getOne(id)
  onlyTeacherOnCourseHasAccess(req, res, instance.course_instance_id)
  res.status(200).json({
    message: '',
    data: instance
  })
})

router.get('/:id/data', async (req, res) => {
  const { id } = req.params
  let instance = await selfAssesmentFormService.getData.prepare(id)
  onlyTeacherOnCourseHasAccess(req, res, instance.course_instance_id)
  instance = selfAssesmentFormService.getData.execute(instance)
  const value = selfAssesmentFormService.getData.value(instance)
  res.status(200).json({
    message: '',
    data: value
  })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const input = req.body
  let instance = await selfAssesmentFormService.edit.prepare(id, input)
  onlyTeacherOnCourseHasAccess(req, res, instance.course_instance_id)
  instance = await selfAssesmentFormService.edit.execute(instance, input)
  const value = selfAssesmentFormService.edit.value(instance)
  res.status(200).json({
    message: '',
    edited: value
  })
})

router.delete(':id', async (req, res) => {
  const { id } = req.params
  const instance = await selfAssesmentFormService.delete.prepare(id)
  onlyTeacherOnCourseHasAccess(req, res, instance.course_instance_id)
  const value = selfAssesmentFormService.delete.value(instance)
  selfAssesmentFormService.delete.execute(instance)
  res.status(200).json({
    message: messages.delete,
    deleted: value
  })
})

module.exports = router
