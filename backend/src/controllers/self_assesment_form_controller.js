const router = require('express').Router()
const { onlyTeacherOnCourseHasAccess } = require('../services/privilege')

const selfAssessmentFormService = require('../services/self_assesment_form_service.js')

router.post('/create', async (req, res) => {
  const input = req.body
  await onlyTeacherOnCourseHasAccess(req, res, input.course_instance_id)
  let instance = await selfAssessmentFormService.create.prepare(input)
  instance = await selfAssessmentFormService.create.execute(instance)
  const value = selfAssessmentFormService.create.value(instance)
  res.status(200).json({
    message: '',
    created: value
  })
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const instance = await selfAssessmentFormService.getOne(id)
  onlyTeacherOnCourseHasAccess(req, res, instance.course_instance_id)
  res.status(200).json({
    message: '',
    data: instance
  })
})

router.get('/:id/data', async (req, res) => {
  const { id } = req.params
  let instance = await selfAssessmentFormService.getData.prepare(id)
  onlyTeacherOnCourseHasAccess(req, res, instance.course_instance_id)
  instance = selfAssessmentFormService.getData.execute(instance)
  const value = selfAssessmentFormService.getData.value(instance)
  res.status(200).json({
    message: '',
    data: value
  })
})

router.put('/:id', async (req, res) => {
  const { id } = req.params
  const input = req.body
  let instance = await selfAssessmentFormService.edit.prepare(id, input)
  onlyTeacherOnCourseHasAccess(req, res, instance.course_instance_id)
  instance = await selfAssessmentFormService.edit.execute(instance, input)
  const value = selfAssessmentFormService.edit.value(instance)
  res.status(200).json({
    message: '',
    edited: value
  })
})

router.delete('/:id', async (req, res) => {
  const { id } = req.params
  const instance = await selfAssessmentFormService.delete.prepare(id)
  onlyTeacherOnCourseHasAccess(req, res, instance.course_instance_id)
  const value = selfAssessmentFormService.delete.value(instance)
  selfAssessmentFormService.delete.execute(instance)
  res.status(200).json({
    message: '',
    deleted: value
  })
})

router.get('/:id/feedback', async (req, res) => {
  const { id } = req.params
  const [responses, selfAssessmentForm] = await selfAssessmentFormService.feedback.prepare(id)
  await onlyTeacherOnCourseHasAccess(req, res, selfAssessmentForm.course_instance_id)
  const data = selfAssessmentFormService.feedback.value(responses, selfAssessmentForm)
  res.status(200).json({
    message: '',
    data
  })
})

router.get('/:id/feedback/:userId', async (req, res) => {
  const { id, userId } = req.params
  const [response, selfAssessmentForm] = await selfAssessmentFormService.individualFeedback.prepare(id, userId)
  if (Number(userId) !== req.user.id) {
    await onlyTeacherOnCourseHasAccess(req, res, selfAssessmentForm.course_instance_id)
  }
  const data = selfAssessmentFormService.individualFeedback.value(response, selfAssessmentForm)
  res.status(200).json({
    message: '',
    data
  })
})

module.exports = router
