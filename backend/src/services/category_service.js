const { Category, Objective } = require('../database/models.js')

const getAllCategories = () => Category.findAll()

const getCourseCategories = courseInstanceId => (
    Category.findAll({ include: { model: Objective, where: { course_instance_id: courseInstanceId } } })
)

module.exports = {
    getAllCategories,
    getCourseCategories
}
