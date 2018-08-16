const router = require('express').Router()

const gradeService = require('../services/grade_service.js')
const { errors } = require('../messages/global.js')
const { checkPrivilege } = require('../services/privilege')

const messages = {
  course: {
    eng: '"Kurssin arvosteluperusteet haettu onnistuneesti." englanniksi.',
    fin: 'Kurssin arvosteluperusteet haettu onnistuneesti.',
    swe: '"Kurssin arvosteluperusteet haettu onnistuneesti." ruotsiksi.'
  },
  create: {
    eng: '"Arvosteluperuste tallennettu onnistuneesti." englanniksi.',
    fin: 'Arvosteluperuste tallennettu onnistuneesti.',
    swe: '"Arvosteluperuste tallennettu onnistuneesti." ruotsiksi.'
  }
}

router.get('/course/:id', async (req, res) => {
  const data = await gradeService.getByCourse(req.params.id, req.lang)
  res.status(200).json({
    message: messages.course[req.lang],
    data
  })
})

router.post('/create', async (req, res) => {
  try {
    const toCreate = await gradeService.create.prepare(req.body)
    if (!await checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: toCreate.dataValues.skill_level.course_instance_id
      }
    ])) {
      res.status(403).json({
        error: errors.privilege[req.lang]
      })
      return
    }
    await gradeService.create.execute(toCreate)
    const created = gradeService.create.value(toCreate, req.lang)
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

module.exports = router
