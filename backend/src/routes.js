const categories = require('./controllers/category_controller')

module.exports = (app) => {
    app.use('/categories', categories)
}