const router = require('express').Router()

const courseInstanceService = require('../services/course_instance_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const { errors } = require('../messages/global.js')
const editRoutes = require('../utils/editRoutes.js')

const messages = {
  data: {
    eng: '"Kurssin data haettu onnistuneesti." englanniksi.',
    fin: 'Kurssin data haettu onnistuneesti.',
    swe: '"Kurssin data haettu onnistuneesti." ruotsiksi.'
  },
  create: {
    eng: '"Kurssi-instanssi luotu onnistuneesti." englanniksi.',
    fin: 'Kurssi-instanssi luotu onnistuneesti.',
    swe: '"Kurssi-instanssi luotu onnistuneesti." ruotsiksi.'
  },
  matrix: {
    eng: '"Kurssin matriisi haettu onnistuneesti." englanniksi.',
    fin: 'Kurssin matriisi haettu onnistuneesti.',
    swe: '"Kurssin matriisi haettu onnistuneesti." ruotsiksi.'
  },
  details: {
    eng: '"Kurssi-instanssin tiedot haettu onnistuneesti." englanniksi.',
    fin: 'Kurssi-instanssin tiedot haettu onnistuneesti.',
    swe: '"Kurssi-instanssin tiedot haettu onnistuneesti." ruotsiksi.'
  },
  edit: {
    eng: '"Kurssi-instanssi muokattu onnistuneesti." englanniksi.',
    fin: 'Kurssi-instanssi muokattu onnistuneesti.',
    swe: '"Kurssi-instanssi muokattu onnistuneesti." ruotsiksi.'
  }
}

router.get('/data/:courseInstanceId', async (req, res) => {
  const data = await courseInstanceService.getCourseInstanceData(req.params.courseInstanceId, req.lang)
  res.status(200).json({
    message: messages.data[req.lang],
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
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  const toCreate = courseInstanceService.create.prepare(req.body)
  await courseInstanceService.create.execute(toCreate, req.user)
  const created = courseInstanceService.create.value(toCreate, req.lang)
  res.status(200).json({
    message: messages.create[req.lang],
    created
  })
})

router.post('/copy', async (req, res) => {
  if (!await checkPrivilege(req, [
    {
      key: 'global_teacher'
    }
  ])) {
    res.status(403).json({
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  const created = await courseInstanceService.copy(req.body, req.user)
  res.status(200).json({
    message: messages.create[req.lang],
    created
  })
})

router.get('/matrix/:id', async (req, res) => {
  const data = await courseInstanceService.matrix(req.params.id, req.lang)
  res.status(200).json({
    message: messages.matrix[req.lang],
    data
  })
})

editRoutes(router, {
  service: courseInstanceService,
  messages,
  errors,
  pathToCourseInstanceId: ['id'],
  route: '/edit'
})

module.exports = router
