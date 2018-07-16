const router = require('express').Router()

const objectiveService = require('../services/objective_service.js')

const messages = {
  create: {
    success: {
      eng: '"Oppimistavoite luotu onnistuneesti." englanniksi.',
      fin: 'Oppimistavoite luotu onnistuneesti.',
      sve: '"Oppimistavoite luotu onnistuneesti." ruotsiksi.'
    }
  },
  delete: {
    success: {
      eng: '"Oppimistavoite poistettu onnistuneesti." englanniksi.',
      fin: 'Oppimistavoite poistettu onnistuneesti.',
      sve: '"Oppimistavoite poistettu onnistuneesti." ruotsiksi.'
    }
  }
}

router.post('/create', async (req, res) => {
  // TODO validate
  const created = (await objectiveService.create(req.body)).toJSON()
  const name = created[`${req.lang}_name`]
  res.status(200).json({
    message: messages.create.success[req.lang],
    created: {
      id: created.id,
      name,
      category_id: created.category_id,
      skill_level_id: created.skill_level_id
    }
  })
})

router.delete('/:id', async (req, res) => {
  // TODO validate
  const deleted = await objectiveService.delete(req.params.id)
  res.status(200).json({
    message: messages.delete.success[req.lang],
    deleted
  })
})

module.exports = router
