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
  },
  delete: {
    eng: '"Arvosteluperuste poistettu onnistuneesti." englanniksi.',
    fin: 'Arvosteluperuste poistettu onnistuneesti.',
    swe: '"Arvosteluperuste poistettu onnistuneesti." ruotsiksi.'
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
    const { instance: toCreate, skillLevel } = await gradeService.create.prepare(req.body)
    if (!await checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: skillLevel.course_instance_id
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

router.delete('/:id', async (req, res) => {
  try {
    const toDelete = await gradeService.delete.prepare(req.params.id)
    if (!await checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: toDelete.dataValues.skill_level.course_instance_id
      }
    ])) {
      res.status(403).json({
        error: errors.privilege[req.lang]
      })
      return
    }
    const deleted = gradeService.delete.value(toDelete)
    gradeService.delete.execute(toDelete)
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

router.get('/:id', async (req, res) => {
  try {
    const data = await gradeService.details(req.params.id)
    if (!data) {
      res.status(404).json({
        error: errors.notfound[req.lang]
      })
      return
    }
    res.status(200).json({
      message: messages.details[req.lang],
      data
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

router.put('/:id', async (req, res) => {
  try {
    const toEdit = await gradeService.edit.prepare(req.params.id)
    if (!toEdit) {
      res.status(404).json({
        error: errors.notfound[req.lang]
      })
      return
    }
    if (!await checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: toEdit.dataValues.skill_level.course_instance_id
      }
    ])) {
      res.status(403).json({
        error: errors.privilege[req.lang]
      })
      return
    }
    await gradeService.edit.execute(toEdit, req.body)
    const edited = gradeService.edit.value(toEdit, req.lang)
    res.status(200).json({
      message: messages.edit[req.lang],
      edited
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
