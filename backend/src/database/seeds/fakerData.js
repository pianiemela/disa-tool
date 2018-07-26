const faker = require('faker')
const oldTasks = require('./tasks.json')


const getTaskObjectives = (tasks, objectives, courseInstances) => {
  const taskObjectives = []
  for (let i = 0; i < courseInstances.length; i++) {
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
          multiplier: (Math.round(Math.random() * 1e2) / 1e2),
          modified: false,
          task_id: courseTasks[taskIndex].id,
          objective_id: obj.id
        })
        if (courseObjectives[taskIndex].course_instance_id !== obj.course_instance_id) {
          console.log('cant have different course_instance_id')
          break
        }
        taskIndex++
      }
    }
  }
  return taskObjectives
}
const getCourseTasks = (courseInstances) => {
  const courseTasks = []
  let tasks = []
  tasks = tasks.concat(oldTasks)

  for (let i = 0; i <= 30; i++) {
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

  for (let a = 0; a < courseInstances.length; a++) {
    const element = courseInstances[a]
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i]
      courseTasks.push({
        ...t, course_instance_id: element.id
      })
    }
  }
  return courseTasks
}

const getStudentsAndTeachers = () => {
  const persons = []
  let number = 12457689
  for (let i = 1; i <= 400; i++) {
    const studentnumber = '0' + number.toString()
    persons.push({
      studentnumber,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      role: 'Student'
    })
    number++
  }
  for (let i = 401; i <= 420; i++) {
    const studentnumber = '0' + number.toString()
    persons.push({
      studentnumber,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      role: 'Teacher'
    })
    number++
  }
// kurki test users
  persons.push({
    studentnumber: '012345678',
    name: 'Teppo Testaaja',
    role: 'Student'
  })

  persons.push({
    studentnumber: '012345688',
    name: 'Angela Merkel',
    role: 'Student'
  })

  persons.push({
    studentnumber: '012345609',
    name: 'Kimg Jon-un',
    role: 'Teacher'
  })

  persons.push({
    studentnumber: '012345679',
    name: 'Terhi Testaaja',
    role: 'Teacher'
  })

  return persons
}

const getCoursePersons = (persons) => {
  const coursePersons = []
  //harcode linis for kurki test users
  const testerteacherId = 424
  coursePersons.push({
    course_instance_id: 1,
    person_id: testerteacherId,
    role: 'Teacher'
  })
  for (let i = 420; i < persons.length; i++) {
    const element = persons[i]
    coursePersons.push({
      course_instance_id: Math.floor(Math.random() * 3) + 1,
      person_id: element.id,
      role: element.role
    })
  }
  for (let i = 0; i < 420; i++) {
    const element = persons[i]
    coursePersons.push({
      course_instance_id: Math.floor(Math.random() * 37) + 1,
      person_id: element.id,
      role: element.role
    })
  }
  return coursePersons
}

const getTypeHeaders = (courseInstances) => {
  const typeHeaders = []
  courseInstances.forEach((element) => {
    typeHeaders.push({
      eng_name: 'Week',
      fin_name: 'Viikko',
      swe_name: 'Vecka',
      course_instance_id: element.id
    })
    typeHeaders.push({
      eng_name: 'Series',
      fin_name: 'Sarja',
      swe_name: 'Serie',
      course_instance_id: element.id
    })
  })
  return typeHeaders
}

const getTypes = (typeHeaders) => {
  const types = []
  const increment = 0.15
  for (let i = 0; i < typeHeaders.length; i++) {
    const header = typeHeaders[i]
    if (header.eng_name === 'Week') {
      let multiplier = 0.1
      for (let i = 0; i < 7; i++) {
        types.push({
          eng_name: i + 1,
          swe_name: i + 1,
          fin_name: i + 1,
          multiplier: Math.round(multiplier * 100) / 100,
          type_header_id: header.id
        })
        multiplier += increment
      }
    } else {
      const sarja = ['A', 'B', 'Stack', 'Vertaisarvio']
      let multiplier = 0.2
      for (let i = 0; i < 3; i++) {
        types.push({
          eng_name: sarja[i],
          swe_name: sarja[i],
          fin_name: sarja[i],
          multiplier: Math.round(multiplier * 100) / 100,
          type_header_id: header.id
        })
        multiplier += increment
      }
    }
  }
  return types
}

const getTaskTypes = (courseInstances, typeHeaders, tasks, types) => {
  const taskTypes = []
  for (let i = 0; i < courseInstances.length; i++) {
    const element = courseInstances[i]
    const weekHeader = typeHeaders.find(header => header.course_instance_id === element.id && header.fin_name === 'Viikko')
    const sarjaHeader = typeHeaders.find(header => header.course_instance_id === element.id && header.fin_name === 'Sarja')
    const courseTypeWeeks = types.filter(t => (t.type_header_id === weekHeader.id))
    const courseTypeSarja = types.filter(t => (t.type_header_id === sarjaHeader.id))
    const courseTasks = tasks.filter(t => t.course_instance_id === element.id)

    for (let a = 0; a < courseTasks.length; a++) {
      const task = courseTasks[a]
      const randWeek = Math.floor(Math.random() * 7)
      const randSarja = Math.random()
      let randSarjaId
      randSarja >= 0.4 ? randSarja >= 0.8 ? randSarjaId = courseTypeSarja[2].id : randSarjaId = courseTypeSarja[1].id : randSarjaId = courseTypeSarja[0].id
      taskTypes.push({
        task_id: task.id,
        type_id: randSarjaId
      })

      taskTypes.push({
        task_id: task.id,
        type_id: courseTypeWeeks[randWeek].id
      })
    }
  }
  return taskTypes
}


module.exports = {
  getStudentsAndTeachers,
  getCoursePersons,
  getCourseTasks,
  getTaskObjectives,
  getTypeHeaders,
  getTypes,
  getTaskTypes
}
