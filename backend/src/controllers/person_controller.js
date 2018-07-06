const router = require('express').Router()
const { validateLang } = require('../middleware/validate.js')
const { checkAuth } = require('../services/auth')

router.get('/user', async (req, res) => {
  const user = await checkAuth(req)
  if (user) {
    res.status(200).json(user)
  } else {
    res.status(204).end()
  }
})

module.exports = router
