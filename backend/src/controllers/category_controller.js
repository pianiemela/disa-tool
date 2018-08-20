const router = require('express').Router()

const categoryService = require('../services/category_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const { errors } = require('../messages/global.js')
const editRoutes = require('../utils/editRoutes.js')

const messages = {
  create: {
    eng: '"Kategoria luotu onnistuneesti." englanniksi.',
    fin: 'Kategoria luotu onnistuneesti.',
    swe: '"Kategoria luotu onnistuneesti." ruotsiksi.'
  },
  delete: {
    eng: '"Kategoria poistettu onnistuneesti." englanniksi.',
    fin: 'Kategoria poistettu onnistuneesti.',
    swe: '"Kategoria poistettu onnistuneesti." ruotsiksi.'
  },
  details: {
    eng: '"Kategorian tiedot haettu onnistuneesti." englanniksi.',
    fin: 'Kategorian tiedot haettu onnistuneesti.',
    swe: '"Kategorian tiedot haettu onnistuneesti." ruotsiksi.'
  },
  edit: {
    eng: '"Kategoria muokattu onnistuneesti." englanniksi.',
    fin: 'Kategoria muokattu onnistuneesti.',
    swe: '"Kategoria muokattu onnistuneesti." ruotsiksi.'
  }
}

router.get('/', async (req, res) => {
  const { courseInstanceId } = req.query
  const categories = await categoryService.getCourseCategories(courseInstanceId, req.lang)
  res.status(200).json(categories)
})

router.post('/create', async (req, res) => {
  const [toCreate, skillLevels] = await categoryService.create.prepare(req.body)
  if (!await checkPrivilege(req, [
    {
      key: 'teacher_on_course',
      param: toCreate.dataValues.course_instance_id
    }
  ])) {
    res.status(403).json({
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  await categoryService.create.execute(toCreate)
  const created = categoryService.create.value(toCreate, skillLevels, req.lang)
  res.status(200).json({
    message: messages.create[req.lang],
    created
  })
})

router.delete('/:id', async (req, res) => {
  const toDelete = await categoryService.delete.prepare(req.params.id)
  if (!toDelete) {
    res.status(404).json({
      error: errors.notfound[req.lang]
    })
    return
  }
  if (!await checkPrivilege(req, [
    {
      key: 'teacher_on_course',
      param: toDelete.dataValues.course_instance_id
    }
  ])) {
    res.status(403).json({
      toast: errors.privilege.toast,
      error: errors.privilege[req.lang]
    })
    return
  }
  const deleted = categoryService.delete.value(toDelete)
  categoryService.delete.execute(toDelete)
  res.status(200).json({
    message: messages.delete[req.lang],
    deleted
  })
})

editRoutes(router, {
  service: categoryService,
  messages,
  errors
})

module.exports = router
