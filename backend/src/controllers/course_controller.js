const router = require('express').Router()
const { checkAuth } = require('../services/auth')

const courseService = require('../services/course_service')
const taskService = require('../services/task_service')
const selfAssesmentService = require('../services/selfAssesment_service')

router.get('/', async (req, res) => {
  const courses = await courseService.getCourses(req.lang)
  res.status(200).json(courses)
})

router.get('/instance/:courseId', async (req, res) => {
  const { courseId } = req.params
  const user = await checkAuth(req)
  const tasks = await taskService.getTasksForCourse(courseId, req.lang, user.id)
  const assessments = await selfAssesmentService.getAssesmentsForCourse(courseId, req.lang, user.id)
  res.status(200).json({ assessments, tasks })
})

router.get('/user', async (req, res) => {
  const user = await checkAuth(req)
  const instances = await courseService.getCoursesForPerson(user.id, req.lang)
  res.status(200).json(instances)
})

router.get('/:courseId', async (req, res) => {
  const { courseId } = req.params
  const instances = await courseService.getCourseInstancesOfCourse(Number(courseId), req.lang)
  res.status(200).json(instances)
})

module.exports = router
