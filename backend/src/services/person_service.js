const { Op } = require('sequelize')
const { Person, CourseInstance, TaskResponse, CoursePerson, Task } = require('../database/models.js')

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
        separate: true,
        where: { task_id: { [Op.in]: tasks } },
        required: false
      }
    ]
  })
)

const getCourseTeachers = courseId => (
  Person.findAll({
    attributes: ['id', 'name'],
    include: [{
      model: CourseInstance,
      where: { id: courseId }
    }, {
      model: CoursePerson,
      where: { role: 'TEACHER' },
      attributes: []
    }]
  })
)

const updateOrCreatePersonsOnCourse = async (coursePersons) => {
  const newPeople = []
  const updatedPeople = []
  await Promise.all(coursePersons.map(async (cp) => {
    const builtCP = await CoursePerson.findOrBuild(
      { where: { person_id: cp.person_id, course_instance_id: cp.course_instance_id }
      }).spread((coursePerson, created) => ({ coursePerson, created }))
    builtCP.coursePerson.role = cp.role
    await builtCP.coursePerson.save()
    if (builtCP.created) {
      const found = (await Person.findByPk(builtCP.coursePerson.person_id, {
        include: [
          { model: CourseInstance, where: { id: builtCP.coursePerson.course_instance_id } },
          {
            model: TaskResponse,
            include: {
              model: Task,
              where: { course_instance_id: builtCP.coursePerson.course_instance_id }
            }
          }
        ]
      })).get({ plain: true })
      found.task_responses = found.task_responses.map(tr => ({ ...tr, task: undefined }))
      newPeople.push(found)
    } else {
      updatedPeople.push(builtCP.coursePerson.get({ plain: true }))
    }
  }))
  return { newPeople, updatedPeople }
}

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
      person_id: newPerson[0].id,
      course_instance_id: courseId,
      role: 'STUDENT',
      studentnumber: newPerson[0].studentnumber }
  }))
  await CoursePerson.bulkCreate(coursePersons, { returning: true })
  return coursePersons
}

const updateGlobal = async (data) => {
  const found = await Person.find({
    where: {
      id: data.personId
    }
  })
  if (!found) return null
  await found.update(
    { role: data.role }
  )
  return found
}

const findPeopleByName = searchString => (
  Person.findAll({ where:
    { name: { [Op.iLike]: `%${searchString}%` } }
  })
)

module.exports = {
  getUser,
  getPeopleOnCourse,
  getCourseTeachers,
  updateOrCreatePersonsOnCourse,
  addPersonsToCourseFromResponses,
  getAllWithRoles,
  getAllWithRolesWhere,
  updateGlobal,
  findPeopleByName
}
