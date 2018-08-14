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
