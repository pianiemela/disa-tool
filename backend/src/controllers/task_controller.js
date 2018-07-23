const router = require('express').Router()

const { checkAuth } = require('../services/auth.js')

const taskService = require('../services/task_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const globalMessages = require('../messages/global_messages.js')

const messages = {
  ...globalMessages,
  create: {
    success: {
      eng: '"Tehtävä luotu onnistuneesti." englanniksi.',
      fin: 'Tehtävä luotu onnistuneesti.',
      swe: '"Tehtävä luotu onnistuneesti." ruotsiksi.'
    }
  }
}

router.get('/user/:courseId', async (req, res) => {
  const user = await checkAuth(req)
  const { courseId } = req.params
  const instances = await taskService.getUserTasksForCourse(user.id, courseId, req.lang)
  res.status(200).json(instances)
})

router.post('/create', async (req, res) => {
  try {
    const toCreate = taskService.prepareCreate(req.body)
    if (!checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: toCreate.dataValues.course_instance_id
      }
    ])) {
      res.status(403).json({
        error: messages.privilege.failure[req.lang]
      })
    }
    await taskService.executeCreate(toCreate)
    const created = taskService.getCreateValue(toCreate, req.lang)
    res.status(200).json({
      message: messages.create.success[req.lang],
      created
    })
  } catch (e) {
    if (process.env.NODE_ENV === 'development') {
      res.status(500).json({
        error: e
      })
    } else {
      res.status(500).json({
        error: messages.unexpected.failure[req.lang]
      })
      console.log(e)
    }
  }
})

module.exports = router
