const Sequelize = require('sequelize')
const { sequelize } = require('./connection.js')

const Task = sequelize.define('task', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING },
  eng_description: { type: Sequelize.STRING(2000) },
  fin_description: { type: Sequelize.STRING(2000) },
  swe_description: { type: Sequelize.STRING(2000) },
  max_points: { type: Sequelize.DOUBLE },
  info: { type: Sequelize.STRING },
  course_instance_id: { type: Sequelize.BIGINT },
  order: { type: Sequelize.FLOAT }
},
{
  tableName: 'task',
  underscored: true,
  timestamps: true
})

const TypeHeader = sequelize.define('type_header', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING },
  course_instance_id: { type: Sequelize.BIGINT },
  order: { type: Sequelize.FLOAT }
},
{
  tableName: 'type_header',
  underscored: true,
  timestamps: true
})

const Type = sequelize.define('type', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING },
  multiplier: { type: Sequelize.DOUBLE },
  type_header_id: { type: Sequelize.BIGINT },
  order: { type: Sequelize.FLOAT }
},
{
  tableName: 'type',
  underscored: true,
  timestamps: true
})

const TaskType = sequelize.define('task_type', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  task_id: { type: Sequelize.BIGINT },
  type_id: { type: Sequelize.BIGINT }
},
{
  tableName: 'task_type',
  underscored: true,
  timestamps: true
})

const Category = sequelize.define('category', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING },
  course_instance_id: { type: Sequelize.BIGINT },
  order: { type: Sequelize.FLOAT }
},
{
  tableName: 'category',
  underscored: true,
  timestamps: true
})

const Objective = sequelize.define('objective', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING },
  category_id: { type: Sequelize.BIGINT },
  course_instance_id: { type: Sequelize.BIGINT },
  skill_level_id: { type: Sequelize.BIGINT },
  order: { type: Sequelize.FLOAT }
},
{
  tableName: 'objective',
  underscored: true,
  timestamps: true
})

const TaskObjective = sequelize.define('task_objective', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  multiplier: { type: Sequelize.DOUBLE },
  modified: { type: Sequelize.BOOLEAN, defaultValue: false },
  task_id: { type: Sequelize.BIGINT },
  objective_id: { type: Sequelize.BIGINT }
},
{
  tableName: 'task_objective',
  underscored: true,
  timestamps: true
})

const SkillLevel = sequelize.define('skill_level', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING },
  course_instance_id: { type: Sequelize.BIGINT },
  order: { type: Sequelize.FLOAT }
},
{
  tableName: 'skill_level',
  underscored: true,
  timestamps: true
})

const Grade = sequelize.define('grade', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING },
  needed_for_grade: { type: Sequelize.DOUBLE },
  skill_level_id: { type: Sequelize.BIGINT },
  prerequisite: { type: Sequelize.BIGINT },
  order: { type: Sequelize.FLOAT }
},
{
  tableName: 'grade',
  underscored: true,
  timestamps: true
})

const CategoryGrade = sequelize.define('category_grade', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  needed_for_grade: { type: Sequelize.DOUBLE },
  grade_id: { type: Sequelize.BIGINT },
  category_id: { type: Sequelize.BIGINT }
},
{
  tableName: 'category_grade',
  underscored: true,
  timestamps: true
})

// const ObjectiveSkillLevel = sequelize.define('objective_skill_level', {
//     id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
//     objective_id: { type: Sequelize.BIGINT },
//     skill_level_id: { type: Sequelize.BIGINT }
// },
// {
//     tableName: 'objective_skill_level',
//     underscored: true,
//     timestamps: true
// })

const Course = sequelize.define('course', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING }
},
{
  tableName: 'course',
  underscored: true,
  timestamps: true
})

const CourseInstance = sequelize.define('course_instance', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING },
  active: { type: Sequelize.BOOLEAN },
  course_id: { type: Sequelize.BIGINT }
},
{
  tableName: 'course_instance',
  underscored: true,
  timestamps: true
})

// const CourseInstanceObjective = sequelize.define('course_instance_objective', {
//     id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
//     course_instance_id: { type: Sequelize.BIGINT },
//     objective_id: { type: Sequelize.BIGINT },
//     skill_level_id: { type: Sequelize.BIGINT }
// },
// {
//     tableName: 'course_instance_objective',
//     underscored: true,
//     timestamps: true
// })

const Person = sequelize.define('person', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  username: { type: Sequelize.STRING, unique: true },
  studentnumber: { type: Sequelize.STRING, unique: true },
  name: { type: Sequelize.STRING },
  role: { type: Sequelize.STRING }
},
{
  tableName: 'person',
  underscored: true,
  timestamps: true
})

// const PersonRole = sequelize.define('person_role', {
//     id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
//     role: { type: Sequelize.STRING },
//     person_id: { type: Sequelize.BIGINT }
// },
// {
//     tableName: 'person_role',
//     underscored: true,
//     timestamps: true
// })

const CoursePerson = sequelize.define('course_person', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  course_instance_id: { type: Sequelize.BIGINT },
  person_id: { type: Sequelize.BIGINT },
  role: { type: Sequelize.STRING }
},
{
  tableName: 'course_person',
  underscored: true,
  timestamps: true
})

const SelfAssessment = sequelize.define('self_assessment', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING },
  eng_instructions: { type: Sequelize.TEXT },
  fin_instructions: { type: Sequelize.TEXT },
  swe_instructions: { type: Sequelize.TEXT },
  structure: { type: Sequelize.JSON },
  open: { type: Sequelize.BOOLEAN },
  active: { type: Sequelize.BOOLEAN },
  show_feedback: { type: Sequelize.BOOLEAN },
  course_instance_id: { type: Sequelize.BIGINT }
},
{
  tableName: 'self_assessment',
  underscored: true,
  timestamps: true
})

const TaskResponse = sequelize.define('task_response', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  points: { type: Sequelize.DOUBLE },
  task_id: { type: Sequelize.BIGINT },
  person_id: { type: Sequelize.BIGINT }
},
{
  tableName: 'task_response',
  underscored: true,
  timestamps: true
})

const AssessmentResponse = sequelize.define('assessment_response', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  response: { type: Sequelize.JSON },
  self_assessment_id: { type: Sequelize.BIGINT },
  person_id: { type: Sequelize.BIGINT }
},
{
  tableName: 'assessment_response',
  underscored: true,
  timestamps: true
})

Type.addHook('afterUpdate', 'updateMultipliers', (type) => {
  Task.findAll({
    attributes: ['id'],
    include: {
      model: Type,
      attributes: ['id', 'multiplier']
    }
  }).then((tasks) => {
    const updatedTasks = tasks.filter(task => task.dataValues.types.find(ttype => ttype.id === type.id))
    updatedTasks.forEach((task) => {
      const defaultMultiplier = task.dataValues.types.reduce((acc, curr) => acc * curr.multiplier, 1)
      TaskObjective.update({
        multiplier: defaultMultiplier
      }, {
        where: {
          task_id: task.dataValues.id,
          modified: false
        }
      })
    })
  })
})

const orderedModels = [
  TypeHeader,
  Type,
  Task,
  Objective,
  Category,
  SkillLevel,
  Grade
]
orderedModels.forEach(model => model.addHook('beforeCreate', 'firstOrder', (instance) => {
  if (!instance.dataValues.order) {
    // eslint-disable-next-line no-param-reassign
    instance.dataValues.order = 1
  }
}))

Task.belongsToMany(Type, { through: TaskType })
Type.belongsToMany(Task, { through: TaskType })
// Redundancy here affords us flexibility in using joins or subqueries.
Task.hasMany(TaskType, { foreignKey: 'task_id', targetKey: 'id' })
Type.hasMany(TaskType, { foreignKey: 'type_id', targetKey: 'id' })
TaskType.belongsTo(Task, { foreignKey: 'task_id', targetKey: 'id' })
TaskType.belongsTo(Type, { foreignKey: 'type_id', targetKey: 'id' })

CourseInstance.hasMany(Task, { foreignKey: 'course_instance_id', targetKey: 'id' })
CourseInstance.hasMany(CoursePerson, { foreignKey: 'course_instance_id', targetKey: 'id' })
CoursePerson.belongsTo(CourseInstance, { foreignKey: 'course_instance_id', targetKey: 'id' })
Task.belongsTo(CourseInstance, { foreignKey: 'course_instance_id', targetKey: 'id' })

Category.hasMany(Objective, { foreignKey: 'category_id', targetKey: 'id' })
Objective.belongsTo(Category, { foreignKey: 'category_id', targetKey: 'id' })

Task.belongsToMany(Objective, { through: TaskObjective })
Objective.belongsToMany(Task, { through: TaskObjective })
// Redundancy here affords us flexibility in using joins or subqueries.
Task.hasMany(TaskObjective, { foreignKey: 'task_id', targetKey: 'id' })
Objective.hasMany(TaskObjective, { foreignKey: 'objective_id', targetKey: 'id' })
TaskObjective.belongsTo(Task, { foreignKey: 'task_id', targetKey: 'id' })
TaskObjective.belongsTo(Objective, { foreignKey: 'objective_id', targetKey: 'id' })


SkillLevel.hasMany(Objective, { foreignKey: 'skill_level_id', targetKey: 'id' })
Objective.belongsTo(SkillLevel, { foreignKey: 'skill_level_id', targetKey: 'id' })
CourseInstance.hasMany(Objective, { foreignKey: 'course_instance_id', targetKey: 'id' })
Objective.belongsTo(CourseInstance, { foreignKey: 'course_instance_id', targetKey: 'id' })

SkillLevel.hasMany(Grade, { foreignKey: 'skill_level_id', targetKey: 'id' })
Grade.belongsTo(SkillLevel, { foreignKey: 'skill_level_id', targetKey: 'id' })

Grade.hasOne(Grade, { foreignKey: 'prerequisite', targetKey: 'id' })

CategoryGrade.belongsTo(Category, { foreignKey: 'category_id', targetKey: 'id' })
CategoryGrade.belongsTo(Grade, { foreignKey: 'grade_id', targetKey: 'id' })
Grade.hasMany(CategoryGrade, { foreignKey: 'grade_id', targetKey: 'id', onDelete: 'cascade', hooks: true })
Category.hasMany(CategoryGrade, { foreignKey: 'category_id', targetKey: 'id', onDelete: 'cascade', hooks: true })

// Objective.belongsToMany(SkillLevel, { through: ObjectiveSkillLevel })
// SkillLevel.belongsToMany(Objective, { through: ObjectiveSkillLevel })

Course.hasMany(CourseInstance, { foreignKey: 'course_id', targetKey: 'id' })
CourseInstance.belongsTo(Course, { foreignKey: 'course_id', targetKey: 'id' })

// CourseInstance.belongsToMany(Objective, { through: CourseInstanceObjective })
// CourseInstance.belongsToMany(SkillLevel, { through: CourseInstanceObjective })
// Objective.belongsToMany(CourseInstance, { through: CourseInstanceObjective })
// Objective.belongsToMany(SkillLevel, { through: CourseInstanceObjective })
// SkillLevel.belongsToMany(CourseInstance, { through: CourseInstanceObjective })
// SkillLevel.belongsToMany(Objective, { through: CourseInstanceObjective })

// Person.hasMany(PersonRole, { foreignKey: 'person_id', targetKey: 'id' })
// PersonRole.belongsTo(Person, { foreignKey: 'person_id', targetKey: 'id' })

Person.belongsToMany(CourseInstance, { through: CoursePerson })
CourseInstance.belongsToMany(Person, { through: CoursePerson })

CourseInstance.hasMany(SelfAssessment, { foreignKey: 'course_instance_id', targetKey: 'id' })
SelfAssessment.belongsTo(CourseInstance, { foreignKey: 'course_instance_id', targetKey: 'id' })

Person.hasMany(TaskResponse, { foreignKey: 'person_id', targetKey: 'id' })
Task.hasMany(TaskResponse, { foreignKey: 'task_id', targetKey: 'id' })
TaskResponse.belongsTo(Person, { foreignKey: 'person_id', targetKey: 'id' })
TaskResponse.belongsTo(Task, { foreignKey: 'task_id', targetKey: 'id' })
Person.belongsToMany(Task, { through: TaskResponse })
Task.belongsToMany(Person, { through: TaskResponse })

Person.hasMany(AssessmentResponse, { foreignKey: 'person_id', targetKey: 'id' })
Person.hasMany(CoursePerson, { foreignKey: 'person_id', targetKey: 'id' })
SelfAssessment.hasMany(AssessmentResponse, { foreignKey: 'self_assessment_id', targetKey: 'id' })
AssessmentResponse.belongsTo(Person, { foreignKey: 'person_id', targetKey: 'id' })
AssessmentResponse.belongsTo(SelfAssessment, { foreignKey: 'self_assessment_id', targetKey: 'id' })

CourseInstance.hasMany(TypeHeader, { foreignKey: 'course_instance_id', targetKey: 'id' })
TypeHeader.belongsTo(CourseInstance, { foreignKey: 'course_instance_id', targetKey: 'id' })

TypeHeader.hasMany(Type, { foreignKey: 'type_header_id', targetKey: 'id' })
Type.belongsTo(TypeHeader, { foreignKey: 'type_header_id', targetKey: 'id' })

CourseInstance.hasMany(Category, { foreignKey: 'course_instance_id', targetKey: 'id' })
Category.belongsTo(CourseInstance, { foreignKey: 'course_instance_id', targetKey: 'id' })

CourseInstance.hasMany(SkillLevel, { foreignKey: 'course_instance_id', targetKey: 'id' })
SkillLevel.belongsTo(CourseInstance, { foreignKey: 'course_instance_id', targetKey: 'id' })

module.exports = {
  Task,
  TypeHeader,
  Type,
  TaskType,
  Category,
  Objective,
  TaskObjective,
  SkillLevel,
  Grade,
  CategoryGrade,
  Course,
  CourseInstance,
  Person,
  CoursePerson,
  SelfAssessment,
  TaskResponse,
  AssessmentResponse
}
