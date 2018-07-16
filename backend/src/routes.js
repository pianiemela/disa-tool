const categories = require('./controllers/category_controller.js')
const courses = require('./controllers/course_controller.js')
const persons = require('./controllers/person_controller.js')
const tasks = require('./controllers/task_controller.js')
const courseInstances = require('./controllers/course_instance_controller.js')
const objectives = require('./controllers/objective_controller.js')
const selfAssesment = require('./controllers/selfAssesment_controller.js')
const login = require('./controllers/login_controller.js')

const BASE_URL = '/api'

module.exports = (app) => {
  app.use(`${BASE_URL}/categories`, categories)
  app.use(`${BASE_URL}/courses`, courses)
  app.use(`${BASE_URL}/persons`, persons)
  app.use(`${BASE_URL}/tasks`, tasks)
  app.use(`${BASE_URL}/course-instances`, courseInstances)
  app.use(`${BASE_URL}/objectives`, objectives)
  app.use(`${BASE_URL}/selfassesment`, selfAssesment)
  app.use(`${BASE_URL}/login`, login)
}
