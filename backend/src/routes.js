const categories = require('./controllers/category_controller.js')
const courses = require('./controllers/course_controller.js')
const persons = require('./controllers/person_controller.js')

const BASE_URL = '/api'


module.exports = (app) => {
  app.use(`${BASE_URL}/categories`, categories)
  app.use(`${BASE_URL}/courses`, courses)
  app.use(`${BASE_URL}/persons`, persons)
}
