const router = require('express').Router()

const { checkPrivilege } = require('../services/privilege.js')
const { errors } = require('../messages/global.js')

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
    }
    data = getAll ? await personService.getAllWithRoles(req.lang) : await personService.getAllWithRolesWhere(studentInfo, req.lang)
    console.log(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({ toast: errors.unexpected.toast, error: errors.unexpected[req.lang] })
  }

  res.status(200).json(
    data
  )
})

router.put('/course_role', async (req, res) => {
  const coursePersons = req.body.filter(async person => checkPrivilege(req, [{
    key: 'teacher_on_course',
    param: person.course_instance_id
  }]))
  if (!coursePersons || coursePersons.length === 0) {
    res.status(403).json({ toast: errors.privilege.toast, error: errors.privilege[req.lang] })
  }
  const updatedPersons = await personService.updatePersonRoleOnCourse(coursePersons)
  res.status(200).json({ message: 'course teachers updated successfully', updatedPersons })
})

module.exports = router
