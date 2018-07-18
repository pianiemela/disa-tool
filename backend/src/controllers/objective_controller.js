const router = require('express').Router()

const objectiveService = require('../services/objective_service.js')
const { checkPrivilege } = require('../services/auth.js')

const messages = {
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
  },
  privilege: {
    failure: {
      eng: '"Pääsy estetty." englanniksi.',
      fin: 'Pääsy estetty.',
      swe: '"Pääsy estetty." ruotsiksi.'
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
  const created = await objectiveService.create(req.body, req.lang)
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
  const deleted = await objectiveService.delete(req.params.id)
  res.status(200).json({
    message: messages.delete.success[req.lang],
    deleted
  })
})

module.exports = router
