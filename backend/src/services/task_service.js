const { Task, TaskResponse, Type } = require('../database/models.js')

const taskAttributes = lang => ['id', [`${lang}_name`, 'name'], [`${lang}_description`, 'description'], 'max_points']
const typeAttributes = lang => ['id', [`${lang}_header`, 'header'], [`${lang}_name`, 'name']]

const getUserTasksForCourse = (userId, courseId, lang) => (
  Task.findAll({
    attributes: taskAttributes(lang),
    where: { course_instance_id: courseId },
    include: { model: TaskResponse, where: { person_id: userId } }
  })
)

const getTasksForCourse = (courseId, lang, userId) => (
  Task.findAll({
    where: { course_instance_id: courseId },
    attributes: taskAttributes(lang),
    include: [{ model: TaskResponse, where: { person_id: userId }, required: false },
      { model: Type, attributes: typeAttributes(lang) }] })
)

const prepareCreate = data => Task.build({
  course_instance_id: data.course_instance_id,
  eng_name: data.eng_name,
  fin_name: data.fin_name,
  swe_name: data.swe_name,
  eng_description: data.eng_description,
  fin_description: data.fin_description,
  swe_description: data.swe_description,
  info: data.info
})

const executeCreate = instance => instance.save()

const getCreateValue = (instance, lang) => {
  const json = instance.toJSON()
  return {
    id: json.id,
    name: json[`${lang}_name`],
    description: json[`${lang}_description`],
    info: json.info,
    objectives: [],
    types: []
  }
}

const prepareDelete = async id => Task.findById(id)

const getDeleteValue = (instance) => {
  const json = instance.toJSON()
  return {
    id: json.id
  }
}

const executeDelete = instance => instance.destroy()

module.exports = {
  getUserTasksForCourse,
  getTasksForCourse,
  prepareCreate,
  executeCreate,
  getCreateValue,
  prepareDelete,
  getDeleteValue,
  executeDelete
}
