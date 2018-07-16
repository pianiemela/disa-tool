const { Course, CourseInstance, Person } = require('../database/models.js')

const instanceAttributes = lang => ['id', 'course_id', [`${lang}_name`, 'name'], 'active']

const getCourseInstancesOfCourse = (courseId, lang) => (
  CourseInstance.findAll({
    where: { course_id: courseId },
    attributes: instanceAttributes(lang)
  })
)

const getCoursesForPeson = (personId, lang) => (
  CourseInstance.findAll({
    include: { model: Person, where: { id: personId } },
    attributes: instanceAttributes(lang)
  })
)

const getCourses = () => Course.findAll()

module.exports = {
  getCourseInstancesOfCourse,
  getCoursesForPeson,
  getCourses
}
