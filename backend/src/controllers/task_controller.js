const router = require('express').Router()

const { checkAuth } = require('../services/auth.js')

const taskService = require('../services/task_service.js')
const { checkPrivilege } = require('../services/privilege.js')
const { errors } = require('../messages/global.js')

const messages = {
  create: {
    eng: '"Tehtävä luotu onnistuneesti." englanniksi.',
    fin: 'Tehtävä luotu onnistuneesti.',
    swe: '"Tehtävä luotu onnistuneesti." ruotsiksi.'
  },
  delete: {
    eng: '"Tehtävä poistettu onnistuneesti." englanniksi.',
    fin: 'Tehtävä poistettu onnistuneesti.',
    swe: '"Tehtävä poistettu onnistuneesti." ruotsiksi.'
  },
  attachObjective: {
    eng: '"Oppimistavoite liitetty tehtävään onnistuneesti." englanniksi.',
    fin: 'Oppimistavoite liitetty tehtävään onnistuneesti.',
    swe: '"Oppimistavoite liitetty tehtävään onnistuneesti." ruotsiksi.'
  },
  detachObjective: {
    eng: '"Oppimistavoite irrotettu tehtävästä onnistuneesti." englanniksi.',
    fin: 'Oppimistavoite irrotettu tehtävästä onnistuneesti.',
    swe: '"Oppimistavoite irrotettu tehtävästä onnistuneesti." ruotsiksi.'
  },
  attachType: {
    eng: '"Tyyppi liitetty tehtävään onnistuneesti." englanniksi.',
    fin: 'Tyyppi liitetty tehtävään onnistuneesti.',
    swe: '"Tyyppi liitetty tehtävään onnistuneesti." ruotsiksi.'
  },
  detachType: {
    eng: '"Tyyppi irrotettu tehtävästä onnistuneesti." englanniksi.',
    fin: 'Tyyppi irrotettu tehtävästä onnistuneesti.',
    swe: '"Tyyppi irrotettu tehtävästä onnistuneesti." ruotsiksi.'
  },
  details: {
    eng: '"Tehtävän tiedot haettu onnistuneesti." englanniksi.',
    fin: 'Tehtävän tiedot haettu onnistuneesti.',
    swe: '"Tehtävän tiedot haettu onnistuneesti." ruotsiksi.'
  },
  edit: {
    eng: '"Tehtävän muutokset tallennettu onnistuneesti." englanniksi.',
    fin: 'Tehtävän muutokset tallennettu onnistuneesti.',
    swe: '"Tehtävän muutokset tallennettu onnistuneesti." ruotsiksi.'
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
    await taskService.create.execute(toCreate)
    const created = taskService.create.value(toCreate, req.lang)
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
    const toDelete = await taskService.delete.prepare(req.params.id)
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
    const deleted = taskService.delete.value(toDelete)
    taskService.delete.execute(toDelete)
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
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }
    taskService.attachObjective.execute(toCreate)
    const created = taskService.attachObjective.value(toCreate)
    res.status(200).json({
      message: messages.attachObjective[req.lang],
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

router.post('/objectives/detach', async (req, res) => {
  try {
    const toDelete = await taskService.detachObjective.prepare(req.body)
    const validation = toDelete.dataValues.task.course_instance_id === toDelete.dataValues.objective.course_instance_id
      && checkPrivilege(req, [
        {
          key: 'teacher_on_course',
          param: toDelete.dataValues.task.course_instance_id
        }
      ])
    if (!validation) {
      res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }
    const deleted = taskService.detachObjective.value(toDelete)
    taskService.detachObjective.execute(toDelete)
    res.status(200).json({
      message: messages.detachObjective[req.lang],
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

router.post('/responses', async (req, res) => {
  const { tasks, courseId } = req.body
  const isTeacher = await checkPrivilege(req, [{
    key: 'teacher_on_course',
    param: courseId
  }])
  if (!isTeacher) {
    res.status(403).json({ toast: errors.privilege.toast, error: errors.privilege })
    return
  }
  try {
    const { updateResponses, newResponses } = await taskService.validateTaskResponses(tasks, courseId)
    const createdResponses = await taskService.createTaskResponses(newResponses)
    const updatedResponses = await taskService.updateTaskResponses(updateResponses)
    res.status(201).json({ msg: 'good job', createdResponses: [...createdResponses, ...updatedResponses] })
  } catch (e) {
    console.log(e)
    res.status(400).json({ error: 'There was something wrong with your request, please try again' })
  }
})

router.post('/types/attach', async (req, res) => {
  try {
    const { task, type, instance: toCreate } = await taskService.attachType.prepare(req.body)
    const validation = task.course_instance_id === type.type_header.course_instance_id
      && checkPrivilege(req, [
        {
          key: 'teacher_on_course',
          param: task.course_instance_id
        }
      ])
    if (!validation) {
      res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }
    taskService.attachType.execute(toCreate)
    const created = taskService.attachType.value(toCreate)
    res.status(200).json({
      message: messages.attachType[req.lang],
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

router.post('/types/detach', async (req, res) => {
  try {
    const toDelete = await taskService.detachType.prepare(req.body)
    const validation = (
      toDelete.dataValues.task.course_instance_id === toDelete.dataValues.type.type_header.course_instance_id
      && checkPrivilege(req, [
        {
          key: 'teacher_on_course',
          param: toDelete.dataValues.task.course_instance_id
        }
      ])
    )
    if (!validation) {
      res.status(403).json({
        toast: errors.privilege.toast,
        error: errors.privilege[req.lang]
      })
      return
    }
    const deleted = taskService.detachType.value(toDelete)
    taskService.detachType.execute(toDelete)
    res.status(200).json({
      message: messages.detachType[req.lang],
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
    const data = await taskService.details(req.params.id)
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
    const toEdit = await taskService.edit.prepare(req.params.id)
    if (!toEdit) {
      res.status(404).json({
        error: errors.notfound[req.lang]
      })
      return
    }
    if (!await checkPrivilege(req, [
      {
        key: 'teacher_on_course',
        param: toEdit.dataValues.course_instance_id
      }
    ])) {
      res.status(403).json({
        error: errors.privilege[req.lang]
      })
      return
    }
    await taskService.edit.execute(toEdit, req.body)
    const edited = taskService.edit.value(toEdit, req.lang)
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
