const router = require('express').Router()
const { login, signJWT } = require('../services/login_service.js')

router.post('', async (req, res) => {
  if (process.env.NODE_ENV !== 'development' && !req.body.username.includes('tester')) {
    res.status(400).json({
      error: 'Stick to test users until security is patched.'
    })
    return
  }
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
  }
  const token = signJWT(result.logged_in)
  result.token = token
  res.status(200).json(result)
})

module.exports = router
