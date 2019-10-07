const router = require('express').Router()
const logger = require('../utils/logger')
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
    const { user } = req
    console.log({ selfAssesmentId })
    console.log(user)
    const data = await assessmentResponseService.getOne(user, selfAssesmentId, req.lang)
    console.log(data)
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
    logger.error(error)
    res.status(500).json({
      error: errors.unexpected[req.lang]
    })
    logger.error(error)
  }
})

router.post('/', async (req, res) => {
  try {
    const data = req.body
    const { user } = req
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
    // Verification and feedback not generated at response submission anymore.
    // try {
    //   const verification = await assessmentResponseService.verifyAssessmentGrade(response, req.lang)
    //   response.response.verification = verification
    //   const feedback = await assessmentResponseService.generateFeedback(response, req.lang)
    //   response.response.feedback = feedback
    //   console.log(feedback)
    // } catch (e) {
    //   logger.error(e)
    // }
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


/**
 * Verification and feedback generation. Done now one at a time.
 */
router.put('/generate-feedbacks/:id', async (req, res) => {
  // req.setTimeout(300000)
  const { id } = req.params
  const response = await assessmentResponseService.getResponseById(id)
  if (!response) {
    res.status(404).json({ error: errors.notfound[req.lang], data: [] })
    return
  }
  const courseInstanceId = await assessmentResponseService.getCourseInstanceId(response.self_assessment_id)
  if (!await checkPrivilege(req, [{ key: 'teacher_on_course', param: courseInstanceId }])) {
    res.status(403).json({ error: errors.privilege[req.lang] })
    return
  }
  if (await selfAssessmentService.getAssessmentType(response.self_assessment_id) === 'objectives') {
    res.status(400).json({ error: 'No feedback generated for this type of assessment' })
    return
  }
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
  const data = await assessmentResponseService.addGradesAndHeaders([completeResponse], courseInstanceId, req.lang)
  res.status(200).json(data[0])
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
