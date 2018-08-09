const router = require('express').Router()

const coursePersonService = require('../services/course_person_service.js')
const { errors } = require('../messages/global.js')

const messages = {
  create: {
    eng: '"Rekisteröityminen onnistui." englanniksi.',
    fin: 'Rekisteröityminen onnistui.',
    swe: '"Rekisteröityminen onnistui." ruotsiksi.'
  },
  delete: {
    eng: '"Rekisteröityminen purettu onnistuneesti." englanniksi.',
    fin: 'Rekisteröityminen purettu onnistuneesti.',
    swe: '"Rekisteröityminen purettu onnistuneesti." ruotsiksi.'
  }
}

router.post('/register', async (req, res) => {
  try {
    const toCreate = coursePersonService.create.prepare(req.body, req.user)
    await coursePersonService.create.execute(toCreate)
    const created = coursePersonService.create.value(toCreate)
    res.status(200).json({
      message: messages.create[req.lang],
      created
    })
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({
        error: e
      })
    } else {
      res.status(500).json({
        error: errors.unexpected[req.lang]
      })
      console.log(e)
    }
  }
})

router.post('/unregister', async (req, res) => {
  try {
    const toDelete = await coursePersonService.delete.prepare(req.body, req.user)
    const deleted = coursePersonService.delete.value(toDelete)
    coursePersonService.delete.execute(toDelete)
    res.status(200).json({
      message: messages.delete[req.lang],
      deleted
    })
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({
        error: e
      })
    } else {
      res.status(500).json({
        error: errors.unexpected[req.lang]
      })
      console.log(e)
    }
  }
})

module.exports = router
