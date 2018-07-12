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
  course_instance_id: { type: Sequelize.BIGINT }
},
{
  tableName: 'task',
  underscored: true,
  timestamps: true
})

const Type = sequelize.define('type', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  eng_header: { type: Sequelize.STRING },
  fin_header: { type: Sequelize.STRING },
  swe_header: { type: Sequelize.STRING },
  eng_name: { type: Sequelize.STRING },
  fin_name: { type: Sequelize.STRING },
  swe_name: { type: Sequelize.STRING },
  multiplier: { type: Sequelize.DOUBLE },
  course_instance_id: { type: Sequelize.BIGINT }
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
  swe_name: { type: Sequelize.STRING }
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
  skill_level_id: { type: Sequelize.BIGINT }
},
{
  tableName: 'objective',
  underscored: true,
  timestamps: true
})

const TaskObjective = sequelize.define('task_objective', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  multiplier: { type: Sequelize.DOUBLE },
  modified: { type: Sequelize.BOOLEAN },
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
  swe_name: { type: Sequelize.STRING }
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
  prerequisite: { type: Sequelize.BIGINT }
},
{
  tableName: 'grade',
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
  studentnumber: { type: Sequelize.STRING },
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
  eng_instructions: { type: Sequelize.STRING },
  fin_instructions: { type: Sequelize.STRING },
  swe_instructions: { type: Sequelize.STRING },
  structure: { type: Sequelize.JSON },
  open: { type: Sequelize.BOOLEAN },
  active: { type: Sequelize.BOOLEAN },
  immediate_feedback: { type: Sequelize.BOOLEAN },
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

Task.belongsToMany(Type, { through: TaskType })
Type.belongsToMany(Task, { through: TaskType })

CourseInstance.hasMany(Task, { foreignKey: 'course_instance_id', targetKey: 'id' })
Task.belongsTo(CourseInstance, { foreignKey: 'course_instance_id', targetKey: 'id' })

Category.hasMany(Objective, { foreignKey: 'category_id', targetKey: 'id' })
Objective.belongsTo(Category, { foreignKey: 'category_id', targetKey: 'id' })

Task.belongsToMany(Objective, { through: TaskObjective })
Objective.belongsToMany(Task, { through: TaskObjective })

SkillLevel.hasMany(Objective, { foreignKey: 'skill_level_id', targetKey: 'id' })
Objective.belongsTo(SkillLevel, { foreignKey: 'skill_level_id', targetKey: 'id' })
CourseInstance.hasMany(Objective, { foreignKey: 'course_instance_id', targetKey: 'id' })
Objective.belongsTo(CourseInstance, { foreignKey: 'course_instance_id', targetKey: 'id' })

SkillLevel.hasMany(Grade, { foreignKey: 'skill_level_id', targetKey: 'id' })
Grade.belongsTo(SkillLevel, { foreignKey: 'skill_level_id', targetKey: 'id' })

Grade.hasOne(Grade, { foreignKey: 'prerequisite', targetKey: 'id' })

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

Person.hasMany(AssessmentResponse, { foreignKey: 'person_id', targetKey: 'id' })
SelfAssessment.hasMany(AssessmentResponse, { foreignKey: 'self_assessment_id', targetKey: 'id' })
AssessmentResponse.belongsTo(Person, { foreignKey: 'person_id', targetKey: 'id' })
AssessmentResponse.belongsTo(SelfAssessment, { foreignKey: 'self_assessment_id', targetKey: 'id' })

CourseInstance.hasMany(Type, { foreignKey: 'course_instance_id', targetKey: 'id' })
Type.belongsTo(CourseInstance, { foreignKey: 'course_instance_id', targetKey: 'id' })

module.exports = {
  Task,
  Type,
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
  AssessmentResponse
}
