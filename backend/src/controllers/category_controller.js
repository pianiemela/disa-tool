const router = require('express').Router()

const categoryService = require('../services/category_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const globalMessages = require('../messages/global_messages.js')

const messages = {
  ...globalMessages
}

router.get('/', async (req, res) => {
  const { courseInstanceId } = req.query
  const categories = await categoryService.getCourseCategories(courseInstanceId, req.lang)
  res.status(200).json(categories)
})

router.post('/create', async (req, res) => {
  const toCreate = categoryService.prepareCreate(req.body)
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
  const created = categoryService.getCreateValue(toCreate, req.lang)
  res.status(200).json({
    message: messages.create.success[req.lang],
    created
  })
})

module.exports = router
