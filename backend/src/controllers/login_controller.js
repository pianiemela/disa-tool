const router = require('express').Router()
const { login, signJWT } = require('../services/login_service.js')

router.post('', async (req, res) => {
  const result = await login(
    {
      username: req.body.username,
      password: req.body.password
    },
    req.lang
  )
  if (result.error) {
    res.status(result.status).json({
      error: result.error
    })
    return
  }
  const token = signJWT(result.logged_in)
  result.token = token
  res.status(200).json(result)
})

module.exports = router
