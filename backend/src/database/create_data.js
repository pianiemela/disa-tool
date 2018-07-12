const { sequelize } = require('./connection.js')
const categories = require('./seeds/categories.json')
const skillLevels = require('./seeds/skill_levels.json')
const courses = require('./seeds/courses.json')
const courseInstances = require('./seeds/course_instances.json')
const objectives = require('./seeds/objectives.json')
const newObjectives = require('./seeds/objectives_new.json')
// const persons = require('./seeds/persons.json')
// const coursePersons = require('./seeds/course_persons.json')
// const tasks = require('./seeds/tasks.json')
const newTasks = require('./seeds/tasks_new.json')
const taskResponses = require('./seeds/task_responses.json')
// const taskObjectives = require('./seeds/task_objectives.json')
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
  AssessmentResponse } = require('./models.js')

const {
  getStudentsAndTeachers,
  getCoursePersons,
  getCourseTasks,
  getTaskObjectives
} = require('./seeds/fakerData')


const persons = getStudentsAndTeachers()
const coursePersons = getCoursePersons(persons)
const tasks = getCourseTasks()
const taskObjectives = getTaskObjectives(tasks, newObjectives)

const createCategories = () => Category.bulkCreate(categories)

const createSkillLevels = () => SkillLevel.bulkCreate(skillLevels)

const createCourses = () => Course.bulkCreate(courses)

const createPersons = () => Person.bulkCreate(persons)

const createCourseInstances = () => CourseInstance.bulkCreate(courseInstances)

const createObjectives = () => Objective.bulkCreate(newObjectives)

const createCoursePersons = () => CoursePerson.bulkCreate(coursePersons)

const createTasks = () => Task.bulkCreate(tasks)

const createTaskObjectives = () => TaskObjective.bulkCreate(taskObjectives)

const createTaskResponses = () => TaskResponse.bulkCreate(taskResponses)


const run = async () => {
  await sequelize.sync({ force: true })
  console.log('forced')
  await createCategories()
  console.log('categories created')
  await createSkillLevels()
  console.log('skill levels created')
  await createCourses()
  console.log('courses created')
  await createPersons()
  console.log('persons created')
  await createCourseInstances()
  console.log('course instances created')
  await createCoursePersons()
  console.log('coursePersons created')
  await createObjectives()
  console.log('objectives created')
  await createTasks()
  console.log('tasks created')
  await createTaskObjectives()
  console.log(`task objectives created`)
  await createTaskResponses()
  console.log('task responses created')
  console.log('ALL DONE')
}

run()
