const { Course, CourseInstance, Person } = require('../database/models.js')

const getCourseInstancesOfCourse = (courseId, lang) => (
  CourseInstance.findAll({
    where: { course_id: courseId },
    attributes: ['id', 'course_id', [`${lang}_name`, 'name']]
  })
)

const getCoursesForPeson = personId => (
  CourseInstance.findAll({ include: { model: Person, where: { id: personId } } })
)

const getCourses = () => Course.findAll()

module.exports = {
  getCourseInstancesOfCourse,
  getCoursesForPeson,
  getCourses
}
