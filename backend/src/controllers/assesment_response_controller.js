const router = require('express').Router()
const { checkAuth } = require('../services/auth')
const { checkPrivilege, isTeacherOnCourse } = require('../services/privilege')
const assessmentResponseService = require('../services/assesment_response_service')
const gradeService = require('../services/grade_service')
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
    console.log(error)
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
    const verification = await assessmentResponseService.verifyAssessmentGrade(response, req.lang)
    response.response.verification = verification
    const feedback = await assessmentResponseService.generateFeedback(response, req.lang)
    response.response.feedback = feedback
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

router.get('/self-assesment/:id', async (req, res) => {
  const { data, courseInstanceId } = await assessmentResponseService.getBySelfAssesment(req.params.id)
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
    } else {
      res.status(500).json({
        error: errors.unexpected[req.lang]
      })
      console.log(e)
    }
  }
})

module.exports = router
