const router = require('express').Router()

const responseService = require('../services/response_service.js')
const { checkPrivilege, onlyTeacherOnCourseHasAccess } = require('../services/privilege.js')
const { errors } = require('../messages/global.js')

const messages = {
  create: {
    eng: '',
    fin: '',
    swe: ''
  },
  getOne: {
    eng: '',
    fin: '',
    swe: ''
  },
  getMany: {
    eng: '',
    fin: '',
    swe: ''
  }
}

router.post('/create', async (req, res) => {
  const inputs = req.body
  const [instance, selfAssessmentForm] = await responseService.create.prepare(inputs, req.user)
  if (!instance) {
    res.status(400).json({
      error: errors.malformed[req.lang]
    })
    return
  }
  const hasPrivilege = await checkPrivilege(req, [{
    key: 'student_on_course',
    param: selfAssessmentForm.course_instance_id
  }])
  if (!hasPrivilege) {
    res.status(403).json({
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  const savedInstance = await responseService.create.execute(instance)
  const created = responseService.create.value(savedInstance)
  res.status(200).json({
    message: messages.create[req.lang],
    created
  })
})

router.get('/self-assessment-form/:id/me', async (req, res) => {
  const { id } = req.params
  const data = await responseService.findOne(id, req.user)
  if (!data) {
    res.status(404).json({
      toast: errors.notfound.toast,
      error: errors.notfound[req.lang]
    })
    return
  }
  res.status(200).json({
    message: messages.getOne[req.lang],
    data
  })
})

router.get('/self-assessment-form/:id', async (req, res) => {
  const { id } = req.params
  const selfAssessmentForm = await responseService.getMany.prepare(id)
  onlyTeacherOnCourseHasAccess(req, res, selfAssessmentForm.course_instance_id)
  const instances = await responseService.getMany.execute(id)
  const data = responseService.getMany.value(instances)
  res.status(200).json({
    message: messages.getMany[req.lang],
    data
  })
})

module.exports = router
