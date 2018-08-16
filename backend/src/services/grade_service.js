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

const create = {
  prepare: async (data) => {
    const [instance, skillLevel] = await Promise.all([
      Grade.build({
        eng_name: data.eng_name,
        fin_name: data.fin_name,
        swe_name: data.swe_name,
        skill_level_id: data.skill_level_id,
        needed_for_grade: data.needed_for_grade,
        prerequisite: data.prerequisite
      }),
      SkillLevel.findById(data.skill_level_id, {
        attributes: ['id', 'course_instance_id']
      })
    ])
    return {
      instance,
      skillLevel: skillLevel.toJSON()
    }
  },
  execute: instance => instance.save(),
  value: (instance, lang) => {
    const json = instance.toJSON()
    return {
      id: json.id,
      name: json[`${lang}_name`],
      skill_level_id: json.skill_level_id,
      needed_for_grade: json.needed_for_grade,
      prerequisite: json.prerequisite
    }
  }
}

const deleteGrade = {
  prepare: id => Grade.findById(id, {
    include: {
      model: SkillLevel,
      attributes: ['id', 'course_instance_id']
    }
  }),
  value: (instance) => {
    const json = instance.toJSON()
    return {
      id: json.id
    }
  },
  execute: instance => instance.destroy()
}

module.exports = {
  getByCourse,
  create,
  delete: deleteGrade
}