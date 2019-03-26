const { SelfAssessmentForm } = require('../database/models')
const { onlyTeacherOnCourseHasAccess } = require('../services/privilege')
const { errors } = require('../messages/global')

const questionModuleCRUD = (router, {
  model,
  route,
  messages
}) => {
  router.post(`${route}/create`, async (req, res) => {
    const inputs = req.body
    let selfAssesmentForm
    try {
      selfAssesmentForm = await SelfAssessmentForm.findByPk(
        inputs.self_assessment_form_id,
        { attributes: ['course_instance_id'] }
      )
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    onlyTeacherOnCourseHasAccess(req, res, selfAssesmentForm.course_instance_id)
    let instance
    try {
      delete inputs.id
      instance = await model.create(inputs, {
        returning: true,
        attributes: Object.keys(inputs)
      })
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    const value = instance.toJSON()
    res.status(200).json({
      message: messages.create[req.lang],
      created: value
    })
  })

  router.get(`${route}/self-assessment-form/:id`, async (req, res) => {
    const { id } = req.params
    let selfAssesmentForm
    try {
      selfAssesmentForm = await SelfAssessmentForm.findByPk(id, {
        attributes: ['course_instance_id'],
        include: { model }
      })
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    onlyTeacherOnCourseHasAccess(req, res, selfAssesmentForm.course_instance_id)
    const value = (
      model.name === 'final_grade_question'
        ? selfAssesmentForm.toJSON().final_grade_question
        // This is a hack that finds the question modules from the include field
        : Object.values(selfAssesmentForm.toJSON()).find(val => Array.isArray(val))
    )
    res.status(200).json({
      message: messages.findBySelfAssessmentForm[req.lang],
      data: value
    })
  })

  router.put(`${route}/:id`, async (req, res) => {
    const { id } = req.params
    const inputs = req.body
    let instance
    try {
      instance = await model.findByPk(id, {
        attributes: ['id', 'self_assessment_form_id'],
        include: {
          model: SelfAssessmentForm,
          attributes: ['course_instance_id']
        }
      })
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    onlyTeacherOnCourseHasAccess(
      req,
      res,
      instance.self_assessment_form.course_instance_id
    )
    try {
      delete inputs.id
      Object.entries(inputs).forEach(([key, value]) => {
        instance[key] = value
      })
      await instance.save()
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    const value = instance.toJSON()
    res.status(200).json({
      message: messages.edit[req.lang],
      edited: value
    })
  })

  router.delete(`${route}/:id`, async (req, res) => {
    const { id } = req.params
    let instance
    try {
      instance = await model.findByPk(id, {
        attributes: ['id', 'self_assessment_form_id'],
        include: {
          model: SelfAssessmentForm,
          attributes: ['course_instance_id']
        }
      })
    } catch (e) {
      res.status(400).json({
        error: errors.malformed[req.lang]
      })
      return
    }
    onlyTeacherOnCourseHasAccess(
      req,
      res,
      instance.self_assessment_form.course_instance_id
    )
    instance.destroy()
    res.status(200).json({
      message: messages.delete[req.lang],
      deleted: { id }
    })
  })
}

module.exports = questionModuleCRUD
