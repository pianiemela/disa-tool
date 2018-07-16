const router = require('express').Router()
const jwt = require('jsonwebtoken')
const axios = require('axios')
const https = require('https')

const { Person } = require('../database/models.js')

router.post('', async (req, res) => {
  const result = await axios.post(`https://${process.env.KURKI_URL}/login`, {
    username: req.body.username,
    password: req.body.password
  },
  {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    }) // This is not production-ready. This line makes axios accept any cert and exposes us to a man-in-the-middle attack.
  })
  if (result.data.error) {
    res.status(403).json({
      error: result.data.error
    })
    return
  }
  res.status(200).json(result.data)
})

module.exports = router
