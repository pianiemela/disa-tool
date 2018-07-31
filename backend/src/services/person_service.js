const { Op } = require('sequelize')
const { Person, CourseInstance, TaskResponse } = require('../database/models.js')

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

module.exports = {
  getUser,
  getPeopleOnCourse
}
