const router = require('express').Router()

const { validateLang } = require('../middleware/validate.js')
const { checkAuth } = require('../services/auth.js')

const taskService = require('../services/task_service.js')

router.get('/user/:courseId', async (req, res) => {
  const lang = validateLang(req)
  const user = await checkAuth(req)
  const { courseId } = req.params
  const instances = await taskService.getUserTasksForCourse(user.id, courseId, lang)
  res.status(200).json(instances)
})

module.exports = router
