const { Category, Objective } = require('../database/models.js')

const getAllCategories = () => Category.findAll()

const getCourseCategories = (courseInstanceId, lang) => (
    Category.findAll({
        attributes: ['id', [`${lang}_name`, 'name']],
        include: {
            model: Objective,
            attributes: ['id', 'course_instance_id', 'skill_level_id', [`${lang}_name`, 'name']],
            where: { course_instance_id: courseInstanceId }
        }
    })
)

module.exports = {
    getAllCategories,
    getCourseCategories
}
