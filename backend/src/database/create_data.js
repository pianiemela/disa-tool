const { sequelize } = require('./connection.js')
const categories = require('./seeds/categories.json')
const skillLevels = require('./seeds/skill_levels.json')
const courses = require('./seeds/courses.json')
const courseInstances = require('./seeds/course_instances.json')
const objectives = require('./seeds/objectives.json')
const persons = require('./seeds/persons.json')
const coursePersons = require('./seeds/course_persons.json')
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


const createCategories = () => Category.bulkCreate(categories)

const createSkillLevels = () => SkillLevel.bulkCreate(skillLevels)

const createCourses = () => Course.bulkCreate(courses)

const createPersons = () => Person.bulkCreate(persons)

const createCourseInstances = () => CourseInstance.bulkCreate(courseInstances)

const createObjectives = () => Objective.bulkCreate(objectives)

const createCoursePersons = () => CoursePerson.bulkCreate(coursePersons)

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

  console.log('ALL DONE')
}

run()
