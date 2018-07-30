const router = require('express').Router()
const { checkAuth } = require('../services/auth')

const courseService = require('../services/course_service')
const taskService = require('../services/task_service')
const selfAssesmentService = require('../services/self_assesment_service')
const personService = require('../services/person_service')

router.get('/', async (req, res) => {
  const courses = await courseService.getCourses(req.lang)
  res.status(200).json(courses)
})

router.get('/instance/:courseId', async (req, res) => {
  const { courseId } = req.params
  const user = await checkAuth(req)
  let instance = await courseService.getInstanceWithRelatedData(courseId, req.lang, user.id)
  if (!instance) {
    res.status(401).json({ error: 'You are not registered on this course' })
    return
  }
  const courseRole = instance.people[0].course_person.role
  if (courseRole === 'TEACHER') {
    const people = await personService.getPeopleOnCourse(courseId, instance.tasks.map(task => task.id))
    instance.dataValues.people = people
  }
  instance.dataValues.courseRole = courseRole
  // const tasks = await taskService.getTasksForCourse(courseId, req.lang, user.id)
  // const assessments = await selfAssesmentService.getAssesmentsForCourse(courseId, req.lang, user.id)

  instance = instance.toJSON()
  instance.tasks = instance.tasks.map(task => ({
    ...task,
    types: task.types.map(ttype => ({ ...ttype, name: `${ttype.type_header.name} ${ttype.name}` })
    )
  }))
  res.status(200).json(instance)
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
