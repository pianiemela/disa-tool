const { Course, CourseInstance } = require('../database/models.js')

const getCourseInstancesOfCourse = (courseId, lang) => (
    CourseInstance.findAll({
        where: { course_id: courseId },
        attributes: ['id', 'course_id', [`${lang}_name`, 'name']]
    })
)

module.exports = {
    getCourseInstancesOfCourse
}
