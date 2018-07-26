const { Course, CourseInstance, Person, CoursePerson, Task, TaskResponse, Type, SelfAssessment, AssessmentResponse, TypeHeader } = require('../database/models.js')

const instanceAttributes = lang => ['id', 'course_id', [`${lang}_name`, 'name'], 'active']
const courseAttributes = lang => ['id', [`${lang}_name`, 'name']]
const assessmentAttributes = lang => [
  'id',
  [`${lang}_name`, 'name'],
  [`${lang}_instructions`, 'instructions'],
  'structure',
  'open',
  'active',
  'immediate_feedback',
  'course_instance_id']
const taskAttributes = lang => ['id', [`${lang}_name`, 'name'], [`${lang}_description`, 'description'], 'max_points']
const typeAttributes = lang => ['id', [`${lang}_name`, 'name']]

const getCourseInstancesOfCourse = (courseId, lang) => (
  CourseInstance.findAll({
    where: { course_id: courseId },
    attributes: instanceAttributes(lang)
  })
)

const getCoursesForPerson = (personId, lang) => (
  CourseInstance.findAll({
    include: { model: Person, where: { id: personId } },
    attributes: instanceAttributes(lang)
  })
)

const getCourses = lang => Course.findAll({ attributes: courseAttributes(lang) })

const getInstanceWithRelatedData = (instanceId, lang, userId) => (
  CourseInstance.find({
    where: { id: instanceId },
    attributes: instanceAttributes(lang),
    include: [
      {
        model: Task,
        attributes: taskAttributes(lang),
        include: [
          { model: TaskResponse, where: { person_id: userId }, required: false },
          {
            model: Type,
            attributes: typeAttributes(lang),
            include: {
              model: TypeHeader,
              where: { course_instance_id: instanceId },
              attributes: courseAttributes(lang)
            }
          }]
      }, {
        model: SelfAssessment,
        attributes: assessmentAttributes(lang),
        include: { model: AssessmentResponse, where: { person_id: userId }, required: false }
      },
      {
        model: Person,
        where: { id: userId }
      }
    ]
  })
)

module.exports = {
  getCourseInstancesOfCourse,
  getCoursesForPerson,
  getCourses,
  getInstanceWithRelatedData
}
