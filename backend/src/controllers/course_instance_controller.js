const router = require('express').Router()

const courseInstanceService = require('../services/course_instance_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const globalMessages = require('../messages/global_messages.js')

const messages = {
  ...globalMessages,
  data: {
    success: {
      eng: '"Kurssin data haettu onnistuneesti." englanniksi.',
      fin: 'Kurssin data haettu onnistuneesti.',
      swe: '"Kurssin data haettu onnistuneesti." ruotsiksi.'
    }
  },
  create: {
    success: {
      eng: '"Kurssi-instanssi luotu onnistuneesti." englanniksi.',
      fin: 'Kurssi-instanssi luotu onnistuneesti.',
      swe: '"Kurssi-instanssi luotu onnistuneesti." ruotsiksi.'
    }
  }
}

router.get('/data/:courseInstanceId', async (req, res) => {
  const data = await courseInstanceService.getCourseInstanceData(req.params.courseInstanceId, req.lang)
  res.status(200).json({
    message: messages.data.success[req.lang],
    data
  })
})

router.get('/:courseInstanceId', async (req, res) => {
  const data = await courseInstanceService.getOne(req.params.courseInstanceId)
  res.status(200).json({
    data
  })
})

router.post('/create', async (req, res) => {
  if (!await checkPrivilege(req, [
    {
      key: 'global_teacher'
    }
  ])) {
    res.status(403).json({
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  const toCreate = courseInstanceService.create.prepare(req.body)
  await courseInstanceService.create.execute(toCreate, req.user)
  const created = courseInstanceService.create.value(toCreate, req.lang)
  res.status(200).json({
    message: messages.create.success[req.lang],
    created
  })
})

module.exports = router
