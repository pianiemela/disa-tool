const router = require('express').Router()

const typeService = require('../services/type_service.js')
const { checkPrivilege } = require('../services/auth.js')
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
  if (!checkPrivilege(req, ['logged_in', 'teacher_on_course'])) {
    res.status(403).json({
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  const created = await typeService.create(req.body, req.lang)
  res.status(200).json({
    message: messages.create.success[req.lang],
    created
  })
})

router.delete('/:id', async (req, res) => {
  if (!checkPrivilege(req, ['logged_in', 'teacher_on_course'])) {
    res.status(403).json({
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  const deleted = await typeService.delete(Number(req.params.id))
  res.status(200).json({
    message: messages.delete.success[req.lang],
    deleted
  })
})

module.exports = router
