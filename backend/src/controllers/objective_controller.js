const router = require('express').Router()

const objectiveService = require('../services/objective_service.js')

router.post('/create', async (req, res) => {
  // TODO validate
  const result = await objectiveService.create(req.body)
  res.status(200).json(result)
})

module.exports = router
