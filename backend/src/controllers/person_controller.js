const router = require('express').Router()

const { checkPrivilege, onlyGlobalTeacherHasAccess, isGlobalTeacher } = require('../services/privilege.js')
const { errors, messages } = require('../messages/global.js')

const personService = require('../services/person_service')

router.get('/user', async (req, res) => {
  if (req.user) {
    res.status(200).json(req.user)
  } else {
    res.status(204).end()
  }
})

router.post('/users', async (req, res) => {
  const { studentInfo, getAll } = req.body
  let data = null
  try {
    const isAdmin = await checkPrivilege(req, [{
      key: 'admin',
      param: null
    }])
    if (!isAdmin) {
      res.status(403).json({
        toast: errors.privilege.toast, error: errors.privilege[req.lang]
      })
      return
    }
    data = getAll ? (
      await personService.getAllWithRoles(req.lang)
    ) : (
      await personService.getAllWithRolesWhere(studentInfo, req.lang)
    )
  } catch (error) {
    console.log(error)
    res.status(500).json({ toast: errors.unexpected.toast, error: errors.unexpected[req.lang] })
    return
  }

  res.status(200).json(
    data
  )
})

router.post('/course_role', async (req, res) => {
  const coursePersons = req.body.filter(async person => checkPrivilege(req, [{
    key: 'teacher_on_course',
    param: person.course_instance_id
  }]))
  const isTeacher = await isGlobalTeacher(req)
  if (!coursePersons || coursePersons.length === 0 || !isTeacher) {
    res.status(403).json({ toast: errors.privilege.toast, error: errors.privilege[req.lang] })
    return
  }
  try {
    const { newPeople, updatedPeople } = await personService.updateOrCreatePersonsOnCourse(coursePersons)
    res.status(200).json({ message: 'course teachers updated successfully', newPeople, updatedPeople })
  } catch (e) {
    res.status(500).json({ error: 'Could not update the people' })
  }
})

router.put('/global-role', async (req, res) => {
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
    const data = await personService.updateGlobal(bodyData)

    res.status(200).json({
      message: messages.update[req.lang],
      data
    })
  } catch (error) {
    res.status(500).json({
      error: errors.unexpected[req.lang]
    })
    console.log(error)
  }
})

router.get('/search', async (req, res) => {
  const { searchString } = req.query
  if (!(await onlyGlobalTeacherHasAccess(req, res))) {
    return
  }
  try {
    const foundPersons = await personService.findPeopleByName(searchString)
    res.status(200).json(foundPersons)
  } catch (e) {
    res.status(500).end()
    console.log(e)
  }
})

module.exports = router
