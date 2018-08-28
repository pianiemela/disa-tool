const {
  Course,
  CourseInstance,
  Person,
  Task,
  TaskResponse,
  Type,
  SelfAssessment,
  AssessmentResponse,
  TypeHeader
} = require('../database/models.js')

const instanceAttributes = lang => ['id', 'course_id', [`${lang}_name`, 'name'], 'active']
const courseAttributes = lang => ['id', [`${lang}_name`, 'name']]
const assessmentAttributes = lang => [
  'id',
  [`${lang}_name`, 'name'],
  [`${lang}_instructions`, 'instructions'],
  'structure',
  'open',
  'active',
  'show_feedback',
  'course_instance_id']
const taskAttributes = lang => ['id', [`${lang}_name`, 'name'], [`${lang}_description`, 'description'], 'max_points']
const typeAttributes = lang => ['id', [`${lang}_name`, 'name']]

const getCourseInstancesOfCourse = async (courseId, user, lang) => {
  const instances = (await CourseInstance.findAll({
    where: { course_id: courseId },
    attributes: instanceAttributes(lang),
    include: {
      model: Person,
      required: false,
      where: {
        id: user ? user.id : null
      },
      attributes: ['id']
    }
  })).map(instance => instance.toJSON())
  return instances.map(instance => ({
    ...instance,
    registered: instance.people.length > 0,
    people: undefined
  }))
}

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
      },
      {
        model: TypeHeader,
        attributes: courseAttributes(lang),
        include: {
          model: Type,
          attributes: typeAttributes(lang)
        }
      }
    ]
  })
)

const toggleActivity = async (id) => {
  const instance = await CourseInstance.findById(id)
  return CourseInstance.update({ active: !instance.active }, { where: { id }, returning: true })
    .then(res => res[1][0])
}

const create = {
  prepare: data => Course.build({
    eng_name: data.eng_name,
    fin_name: data.fin_name,
    swe_name: data.swe_name
  }),
  execute: instance => instance.save(),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`]
    }
  }
}

module.exports = {
  getCourseInstancesOfCourse,
  getCoursesForPerson,
  getCourses,
  getInstanceWithRelatedData,
  create,
  toggleActivity
}
