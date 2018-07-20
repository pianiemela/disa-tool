const router = require('express').Router()

const objectiveService = require('../services/objective_service.js')
const { checkPrivilege, privilegeCode } = require('../services/auth.js')
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
  if (!checkPrivilege(req, [privilegeCode('logged_in'), privilegeCode('teacher_on_course', req.body.course_instance_id)])) {
    res.status(403).json({
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  const created = await objectiveService.create(req.body, req.lang)
  res.status(200).json({
    message: messages.create.success[req.lang],
    created
  })
})

router.delete('/:id', async (req, res) => {
  const toDelete = await objectiveService.prepareDelete(req.params.id)
  if (!checkPrivilege(req, [privilegeCode('logged_in'), privilegeCode('teacher_on_course', toDelete.instance.dataValues.course_instance_id)])) {
    res.status(403).json({
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  toDelete.instance.destroy()
  res.status(200).json({
    message: messages.delete.success[req.lang],
    deleted: toDelete.value
  })
})

module.exports = router
