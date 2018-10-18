const router = require('express').Router()
const logger = require('../utils/logger')
const { checkAuth } = require('../services/auth')
const { checkPrivilege, isTeacherOnCourse } = require('../services/privilege')
const assessmentResponseService = require('../services/assesment_response_service')
const selfAssessmentService = require('../services/self_assesment_service')
const { errors } = require('../messages/global.js')

const messages = {
  getBySelfAssesment: {
    eng: '"Vastaukset haettu onnistuneesti." englanniksi.',
    fin: 'Vastaukset haettu onnistuneesti.',
    swe: '"Vastaukset haettu onnistuneesti." ruotsiksi.'
  }
}


router.get('/:selfAssesmentId', async (req, res) => {
  try {
    const { selfAssesmentId } = req.params
    const user = await checkAuth(req)
    const data = await assessmentResponseService.getOne(user, selfAssesmentId, req.lang)
    if (!data) {
      res.status(200).json({
        data: {}
      })
      return
    }
    // TODO: Maybe further refactor these checks to one helper.
    // only send verification data to teacher
    const isTeacher = await !isTeacherOnCourse(req, data.course_instance_id)
    if (!isTeacher) {
      delete data.response.verification
    }
    // only send feedback to student if it is active
    if (!await selfAssessmentService.isFeedbackActive(selfAssesmentId) && !isTeacher) {
      delete data.response.feedback
    }
    res.status(200).json({ data })
  } catch (error) {
    res.status(500).json({
      error: errors.unexpected[req.lang]
    })
    logger.error(error)
  }
})

router.post('/', async (req, res) => {
  try {
    const data = req.body
    const user = await checkAuth(req)
    const hasPrivilege = await checkPrivilege(req,
      [
        {
          key: 'student_on_course',
          param: data.course_instance_id
        }
      ]
    )
    if (!hasPrivilege) {
      res.status(403).json({
        toast: errors.unexpected.toast,
        error: errors.privilege[req.lang]
      })
      return
    }

    if (data.assessmentType === 'objectives') {
      const response = await assessmentResponseService.create(user, data.assessmentId, data)
      const completeResponse = await response.save()
      if (response) {
        res.status(200).json({
          message: 'Self assessment response saved successfully!',
          data: completeResponse
        })
      }
      return
    }
    const response = await assessmentResponseService.create(user, data.assessmentId, data)
    try {
      const verification = await assessmentResponseService.verifyAssessmentGrade(response, req.lang)
      response.response.verification = verification
      const feedback = await assessmentResponseService.generateFeedback(response, req.lang)
      response.response.feedback = feedback
    } catch (e) {
      logger.error(e)
    }
    // THE RESPONSE IS NOT SAVED UNTIL SAVE IS EXPLICITLY CALLED HERE
    const completeResponse = await response.save()
    // only send verification data to teacher
    const isTeacher = await !isTeacherOnCourse(req, data.course_instance_id)
    if (!isTeacher) {
      delete response.response.verification
    }
    // only send feedback to student if it is active
    if (!await selfAssessmentService.isFeedbackActive(data.assessmentId) && !isTeacher) {
      delete response.response.feedback
    }
    if (response) {
      res.status(200).json({
        message: 'Self assessment response saved successfully!',
        data: completeResponse
      })
    }
  } catch (error) {
    res.status(500).json({
      error: error.message
    })
  }
})

router.put('/generate-feedbacks/:id', async (req, res) => {
  req.setTimeout(300000)
  const { id } = req.params
  // console.log(id)
  const assesmentResponses = await assessmentResponseService.getBySelfAssesment(id, req.lang)
  const courseInstanceId = await assessmentResponseService.getCourseInstanceId(req.params.id, assesmentResponses)
  if (!courseInstanceId) {
    res.status(404).json({ error: errors.notfound[req.lang], data: [] })
    return
  }
  if (!await checkPrivilege(req, [{ key: 'teacher_on_course', param: courseInstanceId }])) {
    res.status(403).json({ error: errors.privilege[req.lang] })
    return
  }
  if (await selfAssessmentService.getAssessmentType(id) === 'objectives') {
    res.status(400).json({ error: 'No feedback generated for this type of assessment' })
    return
  }
  const regeneratedResponses = []
  for (let i = 0; i < assesmentResponses.length; i += 1) {
    const response = assesmentResponses[i]
    const updateResponse = { ...response.response }
    try {
      const verification = await assessmentResponseService.verifyAssessmentGrade(response, req.lang)
      if (!verification) {
        const error = { error: 'Could not calculate verification' }
        throw error
      }
      updateResponse.verification = verification
      const feedback = await assessmentResponseService.generateFeedback(updateResponse, req.lang)
      updateResponse.feedback = feedback
    } catch (e) {
      logger.error(e)
    }
    const completeResponse = await response.update({ response: updateResponse })
    regeneratedResponses.push(completeResponse)
  }
  // const regeneratedResponses = await Promise.all(assesmentResponses.map(async (response) => {
  //   const updateResponse = { ...response.response }
  //   try {
  //     const verification = await assessmentResponseService.verifyAssessmentGrade(response, req.lang)
  //     updateResponse.verification = verification
  //     const feedback = await assessmentResponseService.generateFeedback(response, req.lang)
  //     updateResponse.feedback = feedback
  //   } catch (e) {
  //     console.log(e)
  //   }
  //   const completeResponse = await response.update({ response: updateResponse })
  //   return completeResponse
  // }))
  const data = await assessmentResponseService.addGradesAndHeaders(regeneratedResponses, courseInstanceId, req.lang)
  res.status(200).json(data)
})

router.get('/self-assesment/:id', async (req, res) => {
  // const { data, courseInstanceId } = await assessmentResponseService.getBySelfAssesment(req.params.id, req.lang)
  const assessmentResponses = await assessmentResponseService.getBySelfAssesment(req.params.id, req.lang)
  const courseInstanceId = await assessmentResponseService.getCourseInstanceId(req.params.id, assessmentResponses)
  const data = await assessmentResponseService.addGradesAndHeaders(assessmentResponses, courseInstanceId, req.lang)
  if (!courseInstanceId) {
    res.status(404).json({
      error: errors.notfound[req.lang],
      data: []
    })
    return
  }
  try {
    if (!await checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: courseInstanceId
      }
    ])) {
      res.status(403).json({
        error: errors.privilege[req.lang]
      })
      return
    }
    res.status(200).json({
      message: messages.getBySelfAssesment[req.lang],
      data
    })
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({
        error: e
      })
      logger.error(e)
    } else {
      res.status(500).json({
        error: errors.unexpected[req.lang]
      })
      logger.error(e)
    }
  }
})

module.exports = router
