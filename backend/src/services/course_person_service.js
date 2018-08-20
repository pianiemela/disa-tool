const { CoursePerson } = require('../database/models.js')

const create = {
  prepare: (data, user) => CoursePerson.build({
    course_instance_id: data.course_instance_id,
    person_id: user.id,
    role: 'STUDENT'
  }),
  execute: instance => instance.save(),
  value: (instance) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      course_instance_id: json.course_instance_id,
      person_id: json.person_id,
      role: json.role
    }
  }
}

const deleteCourseperson = {
  prepare: (data, user) => CoursePerson.findOne({
    where: {
      course_instance_id: data.course_instance_id,
      person_id: user.id
    }
  }),
  value: (instance) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      course_instance_id: json.course_instance_id,
      person_id: json.person_id,
      role: json.role
    }
  },
  execute: instance => instance.destroy(),
}

const updateRole = data => (
  CoursePerson.update(
    { role: data.role },
    {
      where: {
        person_id: data.person_id, course_instance_id: data.course_instance_id
      },
      returning: true
    })
)

module.exports = {
  create,
  delete: deleteCourseperson,
  updateRole
}