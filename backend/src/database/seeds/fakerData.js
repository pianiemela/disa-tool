const faker = require('faker')
const courseInstances = require('./course_instances.json')
const oldTasks = require('./tasks.json')


const getTaskObjectives = (tasks, objectives) => {
  const taskObjectives = []
  for (let i = 0; i < courseInstances.length; i++) {
    const taskObjectiveIndex = 0
    const element = courseInstances[i]
    const courseObjectives = objectives.filter(obj => obj.course_instance_id === element.id)
    const courseTasks = tasks.filter(task => task.course_instance_id === element.id)
    let taskIndex = 0

    for (let a = 0; a < courseObjectives.length; a++) {
      const obj = courseObjectives[a]
      for (let index = 0; index < 3; index++) {
        if (taskIndex > courseTasks.length - 1) {
          taskIndex = 0
        }

        taskObjectives.push({
          id: taskObjectiveIndex,
          multiplier: (Math.round(Math.random() * 1e2) / 1e2),
          modfied: false,
          task_id: courseTasks[taskIndex].id,
          objective_id: obj.id
        })


        if (courseObjectives[taskIndex].course_instance_id !== obj.course_instance_id) {
          console.log('CANT HAVE DIFFERENT COURSE INSTANCES FOR OBJECTS AND TASK')
          break
        }
        taskIndex++
      }
    }
  }
  return taskObjectives
}
const getCourseTasks = () => {

  const courseTasks = []
  let tasks = []
  tasks = tasks.concat(oldTasks)

  for (let i = 0; i <= 20; i++) {
    const name = faker.company.catchPhrase()
    const desc = faker.hacker.phrase()
    tasks.push({
      eng_name: name,
      fin_name: name,
      swe_name: name,
      eng_description: desc,
      fin_description: desc,
      swe_description: desc,
      max_points: Math.floor(Math.random() * 3) + 1,
      info: faker.internet.url()
    })
  }
  let taskid = 1

  for (let a = 0; a < courseInstances.length; a++) {
    const element = courseInstances[a]
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i]
      courseTasks.push({
        ...t, course_instance_id: element.id, id: taskid
      })
      taskid++
    }
  }
  return courseTasks
}

const getStudentsAndTeachers = () => {
  const persons = []
  for (let i = 1; i <= 400; i++) {
    const number = faker.random.number({ min: 11111111, max: 99999999 }).toString()
    const studentnumber = '0' + number
    persons.push({
      id: i,
      studentnumber,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      role: 'STUDENT'
    })
  }
  for (let i = 401; i <= 420; i++) {
    const number = faker.random.number({ min: 11111111, max: 99999999 }).toString()
    const studentnumber = '0' + number
    persons.push({
      id: i,
      studentnumber,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      role: 'TEACHER'
    })
  }

  return persons
}

const getCoursePersons = (persons) => {
  const coursePersons = []
  for (let i = 0; i < persons.length; i++) {
    const element = persons[i]
    coursePersons.push({
      id: i + 1,
      course_instance_id: Math.floor(Math.random() * 8) + 1,
      person_id: element.id,
      role: element.role
    })
  }
  return coursePersons
}

const getTypes = (courseInstances) => {
  const types = []
  let multiplier = 0.1
  const increment = 0.15
  let taskId = 1
  for (let i = 0; i < courseInstances.length; i++) {
    const element = courseInstances[i]
    multiplier = 0.1
    for (let i = 0; i < 7; i++) {
      const week = `Viikko ${i + 1}`
      types.push({
        id: taskId,
        eng_header: null,
        fin_header: null,
        swe_header: null,
        eng_name: week,
        swe_name: week,
        fin_name: week,
        multiplier: Math.round(multiplier * 100) / 100,
        course_instance_id: element.id
      })
      multiplier += increment
      taskId++
    }
  }
  return types
}


module.exports = {
  getStudentsAndTeachers,
  getCoursePersons,
  getCourseTasks,
  getTaskObjectives,
  getTypes
}