const { Op } = require('sequelize')
const { SkillLevel, Grade, CategoryGrade, Category } = require('../database/models.js')
const editServices = require('../utils/editServices.js')

const getByCourse = async (id, lang) => {
  const name = [`${lang}_name`, 'name']
  const result = await Grade.findAll({
    attributes: ['id', name, 'skill_level_id', 'needed_for_grade', 'prerequisite', 'order'],
    include: [
      {
        model: SkillLevel,
        attributes: ['id'],
        where: { course_instance_id: id }
      },
      CategoryGrade
    ],
    order: [
      ['order', 'ASC'],
      [SkillLevel, 'order', 'ASC']
    ]
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
        prerequisite: data.prerequisite,
        order: data.order
      }),
      SkillLevel.findByPk(data.skill_level_id, {
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
      prerequisite: json.prerequisite,
      order: json.order
    }
  }
}

const deleteGrade = {
  prepare: id => Grade.findByPk(id, {
    attributes: ['id', 'skill_level_id'],
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

const { details, edit } = editServices(
  Grade,
  {},
  {
    attributes: ['id', 'skill_level_id'],
    include: [{
      model: SkillLevel,
      attributes: ['id', 'course_instance_id']
    }, CategoryGrade],
    saveFields: [
      'eng_name',
      'fin_name',
      'swe_name',
      'skill_level_id',
      'needed_for_grade',
      'prerequisite',
      'order'
    ],
    valueFields: [
      'id',
      ['lang_name', 'name'],
      'skill_level_id',
      'needed_for_grade',
      'prerequisite',
      'category_grades',
      'order'
    ]
  }
)

const createDefaultCategoryGrades = async (grade, courseInstanceId) => {
  const categories = await Category.findAll({ where: { course_instance_id: courseInstanceId } })
  const categoryGrades = categories.map(category => ({
    category_id: category.id,
    grade_id: grade.id,
    needed_for_grade: grade.needed_for_grade
  }))
  return CategoryGrade.bulkCreate(categoryGrades, { returning: true })
}

const filterCategoryGradesOnCourse = async (courseId, categoryGrades) => {
  const grades = await CategoryGrade.findAll({
    where: { id: { [Op.in]: categoryGrades.map(cg => cg.id) } },
    include: Category
  })
  return grades.filter(cg => cg.category.course_instance_id === courseId)
}

const updateCategoryGrades = (oldCategoryGrades, newValues) => (
  Promise.all(oldCategoryGrades.map(async (cg) => {
    const newValue = newValues.find(val => val.id === cg.id)
    cg.set('needed_for_grade', newValue.neededForGrade)
    return cg.save({ returning: true })
  }))
)

module.exports = {
  getByCourse,
  create,
  delete: deleteGrade,
  details,
  edit,
  createDefaultCategoryGrades,
  filterCategoryGradesOnCourse,
  updateCategoryGrades
}
