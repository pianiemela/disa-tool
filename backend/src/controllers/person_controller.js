const router = require('express').Router()

router.get('/user', (req, res) => {
  if (req.user) {
    res.status(200).json(req.user)
  } else {
    res.status(204).end()
  }
})

module.exports = router
