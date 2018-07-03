const { Category } = require('../database/models.js')

const getAllCategories = () => Category.findAll()

module.exports = {
    getAllCategories
}
