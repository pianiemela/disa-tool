const { sequelize } = require('./connection.js')
const categories = require('./seeds/categories.json')
const skillLevels = require('./seeds/skill_levels.json')
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
    PersonRole,
    CoursePerson,
    SelfAssessment,
    TaskResponse,
    AssessmentResponse } = require('./models.js')


const createCategories = () => Category.bulkCreate(categories)

const createSkillLevels = () => SkillLevel.bulkCreate(skillLevels)

const run = async () => {
    await sequelize.sync({ force: true })
    console.log('forced')
    await createCategories()
    console.log('categories created')
    await createSkillLevels()
    console.log('skill levels created')
}

run()
