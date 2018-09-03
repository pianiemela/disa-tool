const router = require('express').Router()

const coursePersonService = require('../services/course_person_service.js')
const { checkPrivilege, isGlobalTeacher, isTeacherOnCourse } = require('../services/privilege.js')
const { errors, messages } = require('../messages/global.js')

router.post('/register', async (req, res) => {
  try {
    const toCreate = coursePersonService.create.prepare(req.body, req.user)
    await coursePersonService.create.execute(toCreate)
    const created = coursePersonService.create.value(toCreate)
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

router.post('/unregister', async (req, res) => {
  try {
    const toDelete = await coursePersonService.delete.prepare(req.body, req.user)
    const deleted = coursePersonService.delete.value(toDelete)
    coursePersonService.delete.execute(toDelete)
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

router.put('/course-role', async (req, res) => {
  try {
    const bodyData = req.body
    const hasPrivilege = checkPrivilege(req, [{
      key: 'admin',
      param: null
    }])
    if (!hasPrivilege) {
      res.status(403).json({
        error: errors.privilege[req.lang]
      })
      return
    }
    const [data, created] = await coursePersonService.updateRole(bodyData)

    res.status(200).json({
      message: created ? messages.create[req.lang] : messages.update[req.lang],
      data
    })
  } catch (error) {
    res.status(500).json({
      error: errors.unexpected[req.lang]
    })
    console.log(error)
  }
})

router.post('/delete', async (req, res) => {
  // Body contains fields id (person_id) and course_instance_id
  const coursePerson = req.body
  if (!isTeacherOnCourse(req) || !isGlobalTeacher(req)) {
    res.status(403).json({ toast: errors.privilege.toast, error: errors.privilege[req.lang] })
  }
  try {
    const person = await coursePersonService.delete.prepare(coursePerson, coursePerson)
    coursePersonService.delete.execute(person)
    res.status(200).json({ message: 'Person successfully removed from course' })
  } catch (e) {
    res.status(500).json({ error: 'There was a problem' })
  }
})

module.exports = router
