const router = require('express').Router()

const objectiveService = require('../services/objective_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const globalMessages = require('../messages/global_messages.js')

const messages = {
  ...globalMessages,
  create: {
    success: {
      eng: '"Oppimistavoite luotu onnistuneesti." englanniksi.',
      fin: 'Oppimistavoite luotu onnistuneesti.',
      swe: '"Oppimistavoite luotu onnistuneesti." ruotsiksi.'
    }
  },
  delete: {
    success: {
      eng: '"Oppimistavoite poistettu onnistuneesti." englanniksi.',
      fin: 'Oppimistavoite poistettu onnistuneesti.',
      swe: '"Oppimistavoite poistettu onnistuneesti." ruotsiksi.'
    }
  }
}

router.post('/create', async (req, res) => {
  const toCreate = await objectiveService.prepareCreate(req.body)
  if (!await checkPrivilege(
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
  await objectiveService.executeCreate(toCreate)
  const created = objectiveService.getCreateValue(toCreate, req.lang)
  res.status(200).json({
    message: messages.create.success[req.lang],
    created
  })
})

router.delete('/:id', async (req, res) => {
  const toDelete = await objectiveService.prepareDelete(req.params.id)
  if (!await checkPrivilege(
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
  const deleted = objectiveService.getDeleteValue(toDelete)
  objectiveService.executeDelete(toDelete)
  res.status(200).json({
    message: messages.delete.success[req.lang],
    deleted
  })
})

module.exports = router
