const router = require('express').Router()
const { checkAuth } = require('../services/auth')

const courseService = require('../services/course_service.js')

router.get('/', async (req, res) => {
  const courses = await courseService.getCourses()
  res.status(200).json(courses)
})

router.get('/instace/:courseId', async (req, res) => {
  const { courseId } = req.params
  const instances = await courseService.getCourseInstancesOfCourse(Number(courseId), req.lang)
  res.status(200).json(instances)
})

router.get('/user', async (req, res) => {
  const user = await checkAuth(req)
  const instances = await courseService.getCoursesForPerson(user.id, req.lang)
  res.status(200).json(instances)
})

module.exports = router
