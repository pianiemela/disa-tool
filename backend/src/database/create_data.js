const { sequelize } = require('./connection.js')
const categories = require('./seeds/categories.json')
const skillLevels = require('./seeds/skill_levels.json')
const courses = require('./seeds/courses.json')
const courseInstances = require('./seeds/course_instances.json')
const newObjectives = require('./seeds/objectives_new.json')
const taskResponses = require('./seeds/task_responses.json')

const { Task,
  TaskType,
  Category,
  Objective,
  TaskObjective,
  SkillLevel,
  Grade,
  Course,
  CourseInstance,
  Person,
  CoursePerson,
  SelfAssessment,
  TaskResponse,
  AssessmentResponse,
  Type } = require('./models.js')

const {
  getStudentsAndTeachers,
  getCourseTasks,
  getTaskObjectives,
  getTypes,
  getTaskTypes,
  getCoursePersons
} = require('./seeds/fakerData')

const MAX_INSTANCES = 6

const randBetween = (start, end) => Math.floor(Math.random() * (end - start) + start)

const createCategories = () => Category.bulkCreate(categories, { returning: true }).map(db0 => db0.toJSON())

const createSkillLevels = () => SkillLevel.bulkCreate(skillLevels, { returning: true }).map(db0 => db0.toJSON())

const createCourses = () => Course.bulkCreate(courses, { returning: true }).map(db0 => db0.toJSON())

const createPersons = persons => Person.bulkCreate(persons, { returning: true }).map(db0 => db0.toJSON())

const createCourseInstances = (listOfCourses, maxInstances) => {
  const instances = []
  listOfCourses.map((course) => {
    let n = 0
    // Hardcoded linis amount to three to match the amount of objectives in objective_new.json
    course.eng_name === 'Lineaarialgebra ja matriisilaskenta I' ? n = 3 : n = randBetween(0, maxInstances)
    for (let i = 0; i < n; i += 1) {
      const semester = Math.random() >= 0.5 ? 'syksy' : 'kevät'
      const name = `${course.fin_name} ${semester} ${2018 + i}`
      instances.push({
        fin_name: name,
        eng_name: name,
        swe_name: name,
        active: Math.random() >= 0.5,
        course_id: course.id
      })
    }
  })
  return CourseInstance.bulkCreate(instances, { returning: true })
  // CourseInstance.bulkCreate(courseInstances, { returning: true }).map(db0 => db0.toJSON())
}

const createObjectives = () => Objective.bulkCreate(newObjectives, { returning: true }).map(db0 => db0.toJSON())

const createCoursePersons = coursePersons => CoursePerson.bulkCreate(coursePersons)

const createTasks = tasks => Task.bulkCreate(tasks, { returning: true }).map(db0 => db0.toJSON())

const createTaskObjectives = taskObjectives => TaskObjective.bulkCreate(taskObjectives, { returning: true }).map(db0 => db0.toJSON())

const createTaskResponses = () => TaskResponse.bulkCreate(taskResponses, { returning: true }).map(db0 => db0.toJSON())

const createTypes = types => Type.bulkCreate(types, { returning: true }).map(db0 => db0.toJSON())

const createTaskTypes = (courseInstances, tasks, types) => TaskType.bulkCreate(getTaskTypes(courseInstances, tasks, types))

const run = async () => {
  await sequelize.sync({ force: true })
  console.log('forced')
  const createdCategories = await createCategories()
  console.log('categories created')
  const createdSkillLevels = await createSkillLevels()
  console.log('skill levels created')
  const createdCourses = await createCourses()
  console.log('courses created')
  const createdPersons = await createPersons(getStudentsAndTeachers())
  console.log('persons created')
  const createdCourseInstances = await createCourseInstances(createdCourses, MAX_INSTANCES)
  // console.log(createdCourseInstances)
  console.log('course instances created')
  const createdCoursePersons = await createCoursePersons(getCoursePersons(createdPersons, createdCourseInstances))
  console.log('coursePersons created')
  const createdObjectives = await createObjectives()
  console.log('objectives created')
  const createdTasks = await createTasks(getCourseTasks(createdCourseInstances))
  console.log('tasks created')
  await createTaskObjectives(getTaskObjectives(createdTasks, createdObjectives, createdCourseInstances))
  console.log('task objectives created')
  await createTaskResponses()
  console.log('task responses created')
  const createdTypes = await createTypes(getTypes(createdCourseInstances))
  console.log('types created')
  // console.log(createdTypes)
  await createTaskTypes(createdCourseInstances, createdTasks, createdTypes)
  console.log('task types created')
  console.log('ALL DONE')
}

run()
