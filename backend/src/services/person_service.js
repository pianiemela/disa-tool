const { Op } = require('sequelize')
const { Person, CourseInstance, TaskResponse, CoursePerson } = require('../database/models.js')

const getUser = userId => Person.find({ where: { id: userId } })

const getPeopleOnCourse = (courseId, tasks) => (
  Person.findAll({
    include: [
      {
        model: CourseInstance,
        where: { id: courseId }
      },
      {
        model: TaskResponse,
        where: { task_id: { [Op.in]: tasks } },
        required: false
      }
    ]
  })
)

const updatePersonRoleOnCourse = coursePersons => (
  Promise.all(coursePersons.map(cp => (
    CoursePerson.update(
      { role: cp.role },
      { where: { person_id: cp.person_id, course_instance_id: cp.course_instance_id },
        returning: true }
    ).then(res => res[1][0])
  )))
)

module.exports = {
  getUser,
  getPeopleOnCourse,
  updatePersonRoleOnCourse
}
