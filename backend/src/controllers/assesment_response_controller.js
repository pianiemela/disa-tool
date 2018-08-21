const router = require('express').Router()
const { checkAuth } = require('../services/auth')
const { checkPrivilege } = require('../services/privilege')
const assementResponseService = require('../services/assesment_response_service')
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
    let data = await assementResponseService.getOne(user, selfAssesmentId)
    if (data) {
      data = data.toJSON()
      data.response = JSON.parse(data.response)
      res.status(200).json({ data })
    }
    res.status(200).json({
      data: {}
    })

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
        toast: errors.privilege.toast,
        error: errors.unexpected[req.lang]
      })
    }

    let response = await assementResponseService.create(user, data.assessmentId, JSON.stringify(data))
    response = response.toJSON()
    response.response = JSON.parse(response.response)
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
  const { data, courseInstanceId } = await assementResponseService.getBySelfAssesment(req.params.id)
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
