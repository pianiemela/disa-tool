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
    const data = await assementResponseService.getOne(user, selfAssesmentId)
    res.status(200).json({
      message: 'homma meni wilduks, mutta tässä asssesmentti',
      data
    })

  } catch (error) {
    res.status(500).json({
      error: errors.unexpected[req.lang]
    })
    console.log(error)
  }
})

module.exports = router
