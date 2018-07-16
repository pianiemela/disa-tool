const router = require('express').Router()

const courseInstanceService = require('../services/course_instance_service.js')

const messages = {
  data: {
    success: {
      eng: '"Kurssin data haettu onnistuneesti." englanniksi.',
      fin: 'Kurssin data haettu onnistuneesti.',
      swe: '"Kurssin data haettu onnistuneesti." ruotsiksi.'
    }
  }
}

router.get('/data/:courseInstanceId', async (req, res) => {
  const data = await courseInstanceService.getCourseInstanceData(req.params.courseInstanceId, req.lang)
  res.status(200).json({
    message: messages.data.success[req.lang],
    data
  })
})

module.exports = router
