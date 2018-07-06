const { Task, TaskResponse, CourseInstance } = require('../database/models.js')

const taskAttributes = lang => ['id', [`${lang}_name`, 'name'], [`${lang}_description`, 'description'], 'max_points']

const getUserTasksForCourse = (userId, courseId, lang) => (
  Task.findAll({
    attributes: taskAttributes(lang),
    where: { course_instance_id: courseId },
    include: { model: TaskResponse, where: { person_id: userId } }
  })
)

module.exports = {
  getUserTasksForCourse
}
