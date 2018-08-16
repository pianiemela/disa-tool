const { SkillLevel, Grade } = require('../database/models.js')

const getByCourse = async (id, lang) => {
  const name = [`${lang}_name`, 'name']
  const result = await Grade.findAll({
    attributes: ['id', name, 'skill_level_id', 'needed_for_grade', 'prerequisite'],
    include: {
      model: SkillLevel,
      attributes: ['id'],
      where: {
        course_instance_id: id
      }
    }
  })
  return result.map(grade => ({ ...grade.toJSON(), skill_level: undefined }))
}

module.exports = {
  getByCourse
}