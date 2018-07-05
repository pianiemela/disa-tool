const router = require('express').Router()
const { validateLang } = require('../middleware/validate.js')
const { checkAuth } = require('../services/auth')

const courseService = require('../services/course_service.js')

router.get('/', async (req, res) => {
  const courses = await courseService.getCourses()
  res.status(200).json(courses)
})

router.get('/instace/:courseId', async (req, res) => {
  const lang = validateLang(req)
  const { courseId } = req.params
  const instances = await courseService.getCourseInstancesOfCourse(Number(courseId), lang)
  res.status(200).json(instances)
})

router.get('/user', async (req, res) => {
  const lang = validateLang(req)
  const user = await checkAuth(req)
  const instances = await courseService.getCoursesForPeson(user.id, lang)
  res.status(200).json(instances)
})

module.exports = router
