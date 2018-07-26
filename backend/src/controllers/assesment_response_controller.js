const router = require('express').Router()
const { checkAuth } = require('../services/auth')
const assesmentService = require('../services/self_assesment_service')
const { checkPrivilege } = require('../services/privilege')
const selfAssesmentService = require('../services/self_assesment_service')

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
    console.log(hasPrivilege)

    const user = await checkAuth(req)
    const data = await assesmentService.getOne()

  } catch (error) {
    console.log(error)
  }
})

module.exports = router
