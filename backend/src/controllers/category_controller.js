const router = require('express').Router()

const categoryService = require('../services/category_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const globalMessages = require('../messages/global_messages.js')

const messages = {
  ...globalMessages,
  create: {
    success: {
      eng: '"Kategoria luotu onnistuneesti." englanniksi.',
      fin: 'Kategoria luotu onnistuneesti.',
      swe: '"Kategoria luotu onnistuneesti." ruotsiksi.'
    }
  },
  delete: {
    success: {
      eng: '"Kategoria poistettu onnistuneesti." englanniksi.',
      fin: 'Kategoria poistettu onnistuneesti.',
      swe: '"Kategoria poistettu onnistuneesti." ruotsiksi.'
    }
  }
}

router.get('/', async (req, res) => {
  const { courseInstanceId } = req.query
  const categories = await categoryService.getCourseCategories(courseInstanceId, req.lang)
  res.status(200).json(categories)
})

router.post('/create', async (req, res) => {
  const [toCreate, skillLevels] = await categoryService.prepareCreate(req.body)
  if (!await checkPrivilege(req, [
    {
      key: 'teacher_on_course',
      param: toCreate.dataValues.course_instance_id
    }
  ])) {
    res.status(403).json({
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  await categoryService.executeCreate(toCreate)
  const created = categoryService.getCreateValue(toCreate, skillLevels, req.lang)
  res.status(200).json({
    message: messages.create.success[req.lang],
    created
  })
})

router.delete('/:id', async (req, res) => {
  const toDelete = await categoryService.prepareDelete(req.params.id)
  if (!toDelete) {
    res.status(404).json({
      error: messages.notfound.failure[req.lang]
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
      error: messages.privilege.failure[req.lang]
    })
    return
  }
  const deleted = categoryService.getDeleteValue(toDelete)
  categoryService.executeDelete(toDelete)
  res.status(200).json({
    message: messages.delete.success[req.lang],
    deleted
  })
})

module.exports = router
