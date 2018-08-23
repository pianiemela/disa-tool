const router = require('express').Router()
const { checkAuth } = require('../services/auth')
const { checkPrivilege } = require('../services/privilege')
const assessmentResponseService = require('../services/assesment_response_service')
const gradeService = require('../services/grade_service')
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
    const data = await assessmentResponseService.getOne(user, selfAssesmentId)

    if (!data) {
      return res.status(200).json({
        data: {}
      })
    }
    // We save the assessmentresponse grades as grades id's to make generating feedback easier,
    // so now we'll fetch each ids name value and return them to the user instead
    const { response } = data.dataValues
    const grades = await gradeService.getByCourse(response.course_instance_id, req.lang)
    response.questionModuleResponses = response.questionModuleResponses.map(qmRes => (
      { ...qmRes, grade: grades.find(g => g.id === qmRes.grade).name }
    ))
    data.dataValues.response = response

    return res.status(200).json({ data })


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
      return res.status(403).json({
        toast: errors.unexpected.toast,
        error: errors.unexpected[req.lang]
      })
    }
    const response = await assessmentResponseService.create(user, data.assessmentId, data)
    const verification = await assessmentResponseService.verifyAssessmentGrade(response)
    response.response.verification = verification
    const feedback = await assessmentResponseService.generateFeedback(response)
    // THE RESPONSE IS NOT SAVED UNTIL SAVE IS EXPLICITLY CALLED HERE
    // const completeResponse = await response.save()
    if (response) {
      res.status(200).json({
        message: 'Self assessment response saved successfully!',
        data: response
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
