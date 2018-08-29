const { Op } = require('sequelize')
const { Person, CourseInstance, TaskResponse, CoursePerson } = require('../database/models.js')

const getUser = userId => Person.find({ where: { id: userId } })

const getAllWithRoles = lang => (
  Person.findAll({
    include: [
      {
        model: CoursePerson,
        include: [
          {
            model: CourseInstance,
            attributes: [[`${lang}_name`, 'name']]
          }
        ]
      }
    ]
  })
)

const getAllWithRolesWhere = (studentInfo, lang) => (
  Person.findAll({
    where: {
      [Op.or]: [
        {
          studentnumber: studentInfo
        },
        {
          name: {
            [Op.iLike]: `%${studentInfo}%`
          }
        }
      ]
    },
    include: [
      {
        model: CoursePerson,
        include: [
          {
            model: CourseInstance,
            attributes: [[`${lang}_name`, 'name']]
          }
        ]

      }
    ]
  })
)
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
      {
        where: { person_id: cp.person_id, course_instance_id: cp.course_instance_id },
        returning: true
      }
    ).then(res => res[1][0])
  )))
)

const addPersonsToCourseFromResponses = async (tasks, courseId) => {
  const uniquePersons = []
  for (let i = 0; i < tasks.length; i += 1) {
    const resp = tasks[i]
    if (uniquePersons.find(student => student.studentnumber === resp.studentnumber) === undefined) {
      uniquePersons.push({ studentnumber: resp.studentnumber })
    }
  }
  const coursePersons = await Promise.all(uniquePersons.map(async (person) => {
    const newPerson = await Person.findOrCreate({
      where: { studentnumber: person.studentnumber },
      defaults: { name: 'NOT REGISTERED', role: 'STUDENT' }
    })
    return {
      data: {
        person_id: newPerson[0].id,
        course_instance_id: courseId,
        role: 'STUDENT',
        studentnumber: newPerson[0].studentnumber
      },
      created: newPerson[1]
    }
  }))
  await CoursePerson.bulkCreate(
    coursePersons
      .filter(person => person.created)
      .map(person => person.data),
    { returning: true }
  )
  return coursePersons.map(person => person.data)
}

const updateGlobal = async (data) => {
  const found = await Person.find({
    where: {
      id: data.person_id
    }
  })

  await found.update(
    { role: data.role }
  )
  return found
}

module.exports = {
  getUser,
  getPeopleOnCourse,
  updatePersonRoleOnCourse,
  addPersonsToCourseFromResponses,
  getAllWithRoles,
  getAllWithRolesWhere,
  updateGlobal
}
