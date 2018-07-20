const router = require('express').Router()

const typeService = require('../services/type_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const globalMessages = require('../messages/global_messages.js')

const messages = {
  ...globalMessages,
  create: {
    success: {
      eng: '"Tyyppi luotu onnistuneesti." englanniksi.',
      fin: 'Tyyppi luotu onnistuneesti.',
      swe: '"Tyyppi luotu onnistuneesti." ruotsiksi.'
    }
  },
  delete: {
    success: {
      eng: '"Tyyppi poistettu onnistuneesti." englanniksi.',
      fin: 'Tyyppi poistettu onnistuneesti.',
      swe: '"Tyyppi poistettu onnistuneesti." ruotsiksi.'
    }
  }
}

router.post('/create', async (req, res) => {
  const toCreate = typeService.prepareCreate(req.body)
  if (!checkPrivilege(
    req,
    [
      {
        key: 'logged_in'
      },
      {
        key: 'teacher_on_course',
        param: toCreate.dataValues.course_instance_id
      }
    ]
  )) {
    res.status(403).json({
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  await typeService.executeCreate(toCreate)
  const created = typeService.getCreateValue(toCreate, req.lang)
  res.status(200).json({
    message: messages.create.success[req.lang],
    created
  })
})

router.delete('/:id', async (req, res) => {
  const toDelete = await typeService.prepareDelete(req.params.id)
  if (!toDelete) {
    res.status(404).json({
      error: messages.notfound.failure[req.lang]
    })
    return
  }
  if (!checkPrivilege(
    req,
    [
      {
        key: 'logged_in'
      },
      {
        key: 'teacher_on_course',
        param: toDelete.dataValues.course_instance_id
      }
    ]
  )) {
    res.status(403).json({
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  const deleted = typeService.getDeleteValue(toDelete)
  typeService.executeDelete(toDelete)
  res.status(200).json({
    message: messages.delete.success[req.lang],
    deleted
  })
})

module.exports = router
