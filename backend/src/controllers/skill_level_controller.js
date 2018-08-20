const router = require('express').Router()

const levelService = require('../services/skill_level_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const { errors } = require('../messages/global.js')
const editRoutes = require('../utils/editRoutes.js')

const messages = {
  create: {
    eng: '"Oppimistaso luotu onnistuneesti." englanniksi.',
    fin: 'Oppimistaso luotu onnistuneesti.',
    swe: '"Oppimistaso luotu onnistuneesti." ruotsiksi.'
  },
  delete: {
    eng: '"Oppimistaso poistettu onnistuneesti." englanniksi.',
    fin: 'Oppimistaso poistettu onnistuneesti.',
    swe: '"Oppimistaso poistettu onnistuneesti." ruotsiksi.'
  },
  details: {
    eng: '"Oppimistason tiedot haettu onnistuneesti." englanniksi.',
    fin: 'Oppimistason tiedot haettu onnistuneesti.',
    swe: '"Oppimistason tiedot haettu onnistuneesti." ruotsiksi.'
  },
  edit: {
    eng: '"Oppimistaso muokattu onnistuneesti." englanniksi.',
    fin: 'Oppimistaso muokattu onnistuneesti.',
    swe: '"Oppimistaso muokattu onnistuneesti." ruotsiksi.'
  }
}

router.post('/create', async (req, res) => {
  const toCreate = levelService.create.prepare(req.body)
  if (!await checkPrivilege(req, [
    {
      key: 'teacher_on_course',
      param: toCreate.dataValues.course_instance_id
    }
  ])) {
    res.status(403).json({
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  await levelService.create.execute(toCreate)
  const created = levelService.create.value(toCreate, req.lang)
  res.status(200).json({
    message: messages.create[req.lang],
    created
  })
})

router.delete('/:id', async (req, res) => {
  const toDelete = await levelService.delete.prepare(req.params.id)
  if (!toDelete) {
    res.status(404).json({
      error: errors.notfound[req.lang]
    })
    return
  }
  if (!await checkPrivilege(req, [
    {
      key: 'teacher_on_course',
      param: toDelete.dataValues.course_instance_id
    }
  ])) {
    res.status(403).json({
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  const deleted = levelService.delete.value(toDelete)
  levelService.delete.execute(toDelete)
  res.status(200).json({
    message: messages.delete[req.lang],
    deleted
  })
})

editRoutes(router, {
  service: levelService,
  messages,
  errors
})

module.exports = router
