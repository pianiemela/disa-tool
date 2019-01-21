const setFKConstraints = (queryInterface, Sequelize) => (modelName, columnName) => queryInterface.changeColumn(
  modelName,
  columnName,
  {
    type: Sequelize.BIGINT,
    references: {
      model: columnName.substring(0, columnName.length - 3),
      key: 'id'
    },
    allowNull: false,
    onDelete: 'CASCADE'
  }
)

const unsetFKConstraints = (queryInterface, Sequelize) => (modelName, columnName) => queryInterface.changeColumn(
  modelName,
  columnName,
  {
    type: Sequelize.BIGINT,
    references: {
      model: columnName.substring(0, columnName.length - 3),
      key: 'id'
    },
    allowNull: true
  }
)

module.exports = {
  up: (queryInterface, Sequelize, done) => {
    const setConstraints = setFKConstraints(queryInterface, Sequelize)
    Promise.all([
      setConstraints('task_type', 'task_id'),
      setConstraints('task_type', 'type_id'),
      setConstraints('course_person', 'course_instance_id'),
      setConstraints('task', 'course_instance_id'),
      setConstraints('objective', 'category_id'),
      setConstraints('task_objective', 'task_id'),
      setConstraints('task_objective', 'objective_id'),
      setConstraints('objective', 'skill_level_id'),
      setConstraints('objective', 'course_instance_id'),
      setConstraints('category_grade', 'grade_id'),
      setConstraints('category_grade', 'category_id'),
      setConstraints('course_instance', 'course_id'),
      setConstraints('task_response', 'task_id'),
      setConstraints('task_response', 'person_id'),
      setConstraints('assessment_response', 'person_id'),
      setConstraints('assessment_response', 'self_assessment_id'),
      setConstraints('type_header', 'course_instance_id'),
      setConstraints('type', 'type_header_id'),
      setConstraints('category', 'course_instance_id'),
      setConstraints('skill_level', 'course_instance_id'),
      setConstraints('grade', 'skill_level_id')
    ]).then(() => done())
  },
  down: (queryInterface, Sequelize, done) => {
    const unsetConstraints = unsetFKConstraints(queryInterface, Sequelize)
    Promise.all([
      unsetConstraints('task_type', 'task_id'),
      unsetConstraints('task_type', 'type_id'),
      unsetConstraints('course_person', 'course_instance_id'),
      unsetConstraints('task', 'course_instance_id'),
      unsetConstraints('objective', 'category_id'),
      unsetConstraints('task_objective', 'task_id'),
      unsetConstraints('task_objective', 'objective_id'),
      unsetConstraints('objective', 'skill_level_id'),
      unsetConstraints('objective', 'course_instance_id'),
      unsetConstraints('category_grade', 'grade_id'),
      unsetConstraints('category_grade', 'category_id'),
      unsetConstraints('course_instance', 'course_id'),
      unsetConstraints('task_response', 'task_id'),
      unsetConstraints('task_response', 'person_id'),
      unsetConstraints('assessment_response', 'person_id'),
      unsetConstraints('assessment_response', 'self_assessment_id'),
      unsetConstraints('type_header', 'course_instance_id'),
      unsetConstraints('type', 'type_header_id'),
      unsetConstraints('category', 'course_instance_id'),
      unsetConstraints('skill_level', 'course_instance_id'),
      unsetConstraints('grade', 'skill_level_id')
    ]).then(() => done())
  }
}
