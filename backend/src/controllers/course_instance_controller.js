const router = require('express').Router()

const courseInstanceService = require('../services/course_instance_service.js')
const { validateLang } = require('../middleware/validate.js')

const messages = {
  data: {
    success: {
      eng: '"Kurssin data haettu onnistuneesti." englanniksi.',
      fin: 'Kurssin data haettu onnistuneesti.',
      sve: '"Kurssin data haettu onnistuneesti." ruotsiksi.'
    }
  }
}

router.get('/data/:courseInstanceId', async (req, res) => {
  const lang = validateLang(req)
  const data = await courseInstanceService.getCourseInstanceData(req.params.courseInstanceId, lang)
  res.status(200).json({
    message: messages.data.success[lang],
    data
  })
})

module.exports = router
