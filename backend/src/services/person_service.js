const { Person, CourseInstance } = require('../database/models.js')

const getUser = userId => Person.find({ where: { id: userId } })

const getPeopleOnCourse = courseId => (
  Person.findAll({
    include: { model: CourseInstance, where: { id: courseId } }
  })
)

module.exports = {
  getUser,
  getPeopleOnCourse
}
