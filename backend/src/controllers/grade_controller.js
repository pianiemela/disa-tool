const router = require('express').Router()

const gradeService = require('../services/grade_service.js')

const messages = {
  course: {
    eng: '"Kurssin arvosteluperusteet haettu onnistuneesti." englanniksi.',
    fin: 'Kurssin arvosteluperusteet haettu onnistuneesti.',
    swe: '"Kurssin arvosteluperusteet haettu onnistuneesti." ruotsiksi.'
  }
}

router.get('/course/:id', async (req, res) => {
  const data = await gradeService.getByCourse(req.params.id, req.lang)
  res.status(200).json({
    message: messages.course[req.lang],
    data
  })
})

module.exports = router
