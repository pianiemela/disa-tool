const { sequelize } = require('./connection.js')
const categories = require('./seeds/categories.json')
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


const createCategories = () => {
    Category.bulkCreate(categories)
}

const run = async () => {
    await sequelize.sync({ force: true })
    console.log('forced')
    createCategories()
}

run()
