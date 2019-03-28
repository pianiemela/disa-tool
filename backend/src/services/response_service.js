const { Response, SelfAssessmentForm } = require('../database/models')

const create = {
  prepare: async (inputs, user) => Promise.all([
    Response.build({
      self_assessment_form_id: inputs.self_assessment_form_id,
      person_id: user.id
    }),
    SelfAssessmentForm.findByPk(inputs.self_assessment_form_id)
  ]),
  execute: async (instance) => {
    const saved = await Response.findOne({
      where: {
        self_assessment_form_id: instance.self_assessment_form_id,
        person_id: instance.person_id
      }
    })
    if (!saved) {
      return instance.save()
    }
    return saved
  },
  value: instance => ({
    id: instance.id,
    self_assessment_form_id: instance.self_assessment_form_id,
    person_id: instance.id
  })
}

const getOne = async (id, user) => {
  const instance = await Response.findOne({
    where: {
      self_assessment_form_id: id,
      person_id: user.id
    }
  })
  return (
    instance
      ? {
        id: instance.id,
        self_assessment_form_id: instance.self_assessment_form_id,
        person_id: instance.person_id
      }
      : null
  )
}

const getMany = {
  prepare: id => SelfAssessmentForm.findByPk(id, {
    attributes: ['course_instance_id']
  }),
  execute: id => Response.findAll({
    where: {
      self_assessment_form_id: id
    }
  }),
  value: instances => instances.map(instance => ({
    id: instance.id,
    self_assessment_form_id: instance.self_assessment_form_id,
    person_id: instance.person_id
  }))
}

module.exports = {
  create,
  getOne,
  getMany
}
