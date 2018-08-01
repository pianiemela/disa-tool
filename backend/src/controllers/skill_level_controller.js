const router = require('express').Router()

const levelService = require('../services/skill_level_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const globalMessages = require('../messages/global_messages.js')

const messages = {
  ...globalMessages,
  create: {
    success: {
      eng: '"Oppimistaso luotu onnistuneesti." englanniksi.',
      fin: 'Oppimistaso luotu onnistuneesti.',
      swe: '"Oppimistaso luotu onnistuneesti." ruotsiksi.'
    }
  },
  delete: {
    success: {
      eng: '"Oppimistaso poistettu onnistuneesti." englanniksi.',
      fin: 'Oppimistaso poistettu onnistuneesti.',
      swe: '"Oppimistaso poistettu onnistuneesti." ruotsiksi.'
    }
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
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  await levelService.create.execute(toCreate)
  const created = levelService.create.value(toCreate, req.lang)
  res.status(200).json({
    message: messages.create.success[req.lang],
    created
  })
})

router.delete('/:id', async (req, res) => {
  const toDelete = await levelService.delete.prepare(req.params.id)
  if (!toDelete) {
    res.status(404).json({
      error: messages.notfound.failure[req.lang]
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
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  const deleted = levelService.delete.value(toDelete)
  levelService.delete.execute(toDelete)
  res.status(200).json({
    message: messages.delete.success[req.lang],
    deleted
  })
})

module.exports = router
