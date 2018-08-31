const router = require('express').Router()
const { login, signJWT } = require('../services/login_service.js')

const messages = {
  create: {
    eng: '"Uusi käyttäjä luotu onnistuneesti." englanniksi.',
    fin: 'Uusi käyttäjä luotu onnistuneesti.',
    swe: '"Uusi käyttäjä luotu onnistuneesti." ruotsiksi.'
  },
  login: {
    eng: '"Sisäänkirjautuminen onnistui." englanniksi.',
    fin: 'Sisäänkirjautuminen onnistui.',
    swe: '"Sisäänkirjautuminen onnistui." ruotsiksi.'
  }
}

const errors = {
  wrong_creds: {
    eng: '"Väärä salasana tai käyttäjänimi." englanniksi.',
    fin: 'Väärä salasana tai käyttäjänimi.',
    swe: '"Väärä salasana tai käyttäjänimi." ruotsiksi.'
  }
}

const statuses = {
  wrong_creds: 403
}

router.post('', async (req, res) => {
  const result = await login({
    username: req.body.username,
    password: req.body.password
  })
  if (result.error) {
    res.status(statuses[result.error]).json({
      error: errors[result.error][req.lang]
    })
    return
  }
  const token = signJWT(result.logged_in)
  res.status(200).json({
    message: result.created ? messages.create[req.lang] : messages.login[req.lang],
    logged_in: result.logged_in,
    token
  })
})

module.exports = router
