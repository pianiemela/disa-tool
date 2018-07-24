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
  },
  delete: {
    success: {
      eng: '"Tehtävä poistettu onnistuneesti." englanniksi.',
      fin: 'Tehtävä poistettu onnistuneesti.',
      swe: '"Tehtävä poistettu onnistuneesti." ruotsiksi.'
    }
  },
  attachObjective: {
    success: {
      eng: '"Oppimistavoite liitetty tehtävään onnistuneesti." englanniksi.',
      fin: 'Oppimistavoite liitetty tehtävään onnistuneesti.',
      swe: '"Oppimistavoite liitetty tehtävään onnistuneesti." ruotsiksi.'
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
    const toCreate = taskService.create.prepare(req.body)
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
    await taskService.create.execute(toCreate)
    const created = taskService.create.value(toCreate, req.lang)
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

router.delete('/:id', async (req, res) => {
  try {
    const toDelete = await taskService.delete.prepare(req.params.id)
    if (!checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: toDelete.dataValues.course_instance_id
      }
    ])) {
      res.status(403).json({
        error: messages.privilege.failure[req.lang]
      })
    }
    const deleted = taskService.delete.value(toDelete)
    taskService.delete.execute(toDelete)
    res.status(200).json({
      message: messages.delete.success[req.lang],
      deleted
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

router.post('/objectives/attach', async (req, res) => {
  try {
    const { task, objective, instance: toCreate } = await taskService.attachObjective.prepare(req.body)
    const validation = task.course_instance_id === objective.course_instance_id
      && checkPrivilege(req, [
        {
          key: 'teacher_on_course',
          param: task.course_instance_id
        }
      ])
    if (!validation) {
      res.status(403).json({
        error: messages.privilege.failure[req.lang]
      })
      return
    }
    taskService.attachObjective.execute(toCreate)
    const created = taskService.attachObjective.value(toCreate)
    res.status(200).json({
      message: messages.attachObjective.success[req.lang],
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
