const { Category, Objective } = require('../database/models.js')

const getAllCategories = () => Category.findAll()

const getCourseCategories = (courseInstanceId, lang) => (
  Category.findAll({
    attributes: ['id', [`${lang}_name`, 'name']],
    include: {
      model: Objective,
      attributes: ['id', 'course_instance_id', 'skill_level_id', [`${lang}_name`, 'name']],
      where: { course_instance_id: courseInstanceId }
    }
  })
)

const prepareCreate = (data) => {
  const instance = Category.build({
    course_instance_id: data.course_instance_id,
    eng_name: data.eng_name,
    fin_name: data.fin_name,
    swe_name: data.swe_name
  })
  return instance
}

const executeCreate = async (instance) => {
  await instance.save()
}

const getCreateValue = (instance, lang) => {
  const json = instance.toJSON()
  return {
    id: json.id,
    name: json[`${lang}_name`]
  }
}

module.exports = {
  getAllCategories,
  getCourseCategories,
  prepareCreate,
  executeCreate,
  getCreateValue
}
