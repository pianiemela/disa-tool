const faker = require('faker')
const fs = require('fs')

const objectives = require('./objectives_new.json')
const tasks = require('./tasks_new.json')
const courseInstances = require('./course_instances.json')

const taskObjectives = []
for (let i = 0; i < courseInstances.length; i++) {
  let taskObjectiveIndex = 0
  let ement = courseInstances[i]
  const courseObjectives = objectives.filter(obj => obj.course_instance_id === ement.id)
  const courseTasks = tasks.filter(task => task.course_instance_id === ement.id)
  let taskIndex = 0
  for (let a = 0; a < courseObjectives.length; a++) {
    const element = courseObjectives[a]
    for (let index = 0; index < 3; index++) {
      if (taskIndex > courseTasks.length - 1) {
        taskIndex = 0
      }

      taskObjectives.push({
        id: taskObjectiveIndex,
        multiplier: (Math.round(Math.random() * 1e2) / 1e2),
        modfied: false,
        task_id: courseTasks[taskIndex].id,
        objective_id: element.id
      })


      if (courseObjectives[taskIndex].course_instance_id !== element.course_instance_id) {
        console.log('CANT HAVE DIFFERENT COURSSE INSTANCES FOR OBJECTS AND TASK')
        break
      }
      taskIndex++
    }
  }
}

const data = JSON.stringify(taskObjectives)
fs.writeFileSync('task_objectives.json', data)

for (let i = 0; i < persons.length; i++) {
  const element = persons[i]
  coursePersons.push({
    id: i,
    course_instance_id: Math.floor(Math.random() * 8) + 1,
    person_id: element.id,
    role: element.role
  })
}
let id = 1
for (let i = 0; i < courseInstances.length; i++) {
  const instance = courseInstances[i]
  for (let a = 0; a < objectives.length; a++) {
    const object = objectives[a]
    courseObjectives.push(
      { ...object, course_instance_id: instance.id, id }
    )
    id++
  }
}

for (let i = 6; i <= 25; i++) {
  const name = faker.company.catchPhrase()
  const desc = faker.hacker.phrase()
  courseTasks.push({
    eng_name: name,
    fin_name: name,
    swe_name: name,
    eng_description: desc,
    fin_description: desc,
    swe_description: desc,
    max_points: Math.floor(Math.random() * 3) + 1,
    info: faker.internet.url(),
  })
}
let iidee = 5

for (let a = 0; a < courseInstances.length; a++) {
  const element = courseInstances[a]
  iidee++
  for (let i = 0; i < courseTasks.length; i++) {
    const t = courseTasks[i]
    tasks.push({
      ...t, course_instance_id: element.id, id: iidee
    })
    iidee++
  }
}

const createStudentsAndTeachers = () => {
  const persons = []
  for (let i = 1; i <= 400; i++) {
    const number = faker.random.number({ min: 11111111, max: 99999999 }).toString()
    const studentNumber = '0' + number
    persons.push({
      id: i,
      studentNumber,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      role: 'STUDENT'
    })
  }
  for (let i = 401; i <= 420; i++) {
    const number = faker.random.number({ min: 11111111, max: 99999999 }).toString()
    const studentNumber = '0' + number
    persons.push({
      id: i,
      studentNumber,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      role: 'TEACHER'
    })
  }

  return persons
}

module.exports = {
  createStudentsAndTeachers
}