const categories = require('./controllers/category_controller.js')
const courses = require('./controllers/course_controller.js')

module.exports = (app) => {
    app.use('/categories', categories)
    app.use('/courses', courses)
}
