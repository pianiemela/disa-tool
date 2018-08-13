const router = require('express').Router()
const { checkAuth } = require('../services/auth')
const { checkPrivilege } = require('../services/privilege')
const selfAssesmentService = require('../services/self_assesment_service')
const assementResponseService = require('../services/assesment_response_service')
const { errors } = require('../messages/global.js')


router.get('/:selfAssesmentId', async (req, res) => {
  try {
    const { selfAssesmentId } = req.params
    const assesment = await selfAssesmentService.getOne(selfAssesmentId)

    const hasPrivilege = await checkPrivilege(req,
      [
        {
          key: 'student_on_course',
          param: assesment.course_instance_id
        }
      ]
    )
    if (!hasPrivilege) {
      return res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege
      })
    }
    const user = await checkAuth(req)
    let data = await assementResponseService.getOne(user, selfAssesmentId)
    data = data.toJSON()
    data.response = JSON.parse(data.response)
    res.status(200).json({
      data
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
        error: errors.privilege
      })
    }

    let response = await assementResponseService.createOrUpdate(user, data.assessmentId, JSON.stringify(data))
    response = response.toJSON()
    response.response = JSON.parse(response.response)
    res.status(200).json({
      message: 'hyvin meni',
      data: response
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: errors.unexpected[req.lang]
    })
  }
})

module.exports = router
