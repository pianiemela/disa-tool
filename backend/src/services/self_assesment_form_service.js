const {
  SelfAssessmentForm,
  FinalGradeQuestion,
  OpenQuestion,
  CategoryQuestion,
  ObjectiveQuestion
} = require('../database/models')

const create = {
  prepare: input => input, // TODO: validate inputs
  execute: input => SelfAssessmentForm.create({
    course_instance_id: input.course_instance_id,
    eng_name: input.eng_name,
    fin_name: input.fin_name,
    swe_name: input.swe_name,
    eng_instructions: input.eng_instructions,
    fin_instructions: input.fin_instructions,
    swe_instructions: input.swe_instructions,
    type: input.type,
    open: false,
    active: false,
    show_feedback: false
  }),
  value: instance => ({
    id: instance.id,
    course_instance_id: instance.course_instance_id,
    eng_name: instance.eng_name,
    fin_name: instance.fin_name,
    swe_name: instance.swe_name,
    eng_instructions: instance.eng_instructions,
    fin_instructions: instance.fin_instructions,
    swe_instructions: instance.swe_instructions,
    type: instance.type,
    open: false,
    active: false,
    show_feedback: false
  })
}

const deleteService = {
  prepare: id => SelfAssessmentForm.findByPk(id),
  execute: instance => instance.destroy(),
  value: instance => ({ id: instance.id })
}

const getOne = id => SelfAssessmentForm.findByPk(id, {
  attributes: [
    'id',
    'eng_name',
    'fin_name',
    'swe_name',
    'eng_instructions',
    'fin_instructions',
    'swe_instructions',
    'open',
    'active',
    'show_feedback',
    'type',
    'course_instance_id'
  ]
})

const getData = {
  prepare: id => SelfAssessmentForm.findByPk(id),
  execute: ({ id }) => SelfAssessmentForm.findByPk(id, {
    attributes: [
      'id',
      'eng_name',
      'fin_name',
      'swe_name',
      'eng_instructions',
      'fin_instructions',
      'swe_instructions',
      'open',
      'active',
      'show_feedback',
      'type',
      'course_instance_id'
    ],
    includes: [
      {
        model: FinalGradeQuestion,
        attributes: [
          'id',
          'eng_prompt',
          'fin_prompt',
          'swe_prompt',
          'text_field'
        ]
      },
      {
        model: OpenQuestion,
        attributes: [
          'id',
          'eng_prompt',
          'fin_prompt',
          'swe_prompt',
          'order'
        ]
      },
      {
        model: CategoryQuestion,
        attributes: [
          'id',
          'category_id',
          'text_field',
          'order'
        ]
      },
      {
        model: ObjectiveQuestion,
        attributes: [
          'id',
          'objective_id',
          'order'
        ]
      }
    ]
  }),
  value: instance => instance.toJSON()
}

const edit = {
  prepare: (id, inputs) => {
    // TODO: validate inputs
    return SelfAssessmentForm.findByPk(id, {
      attributes: [
        'id',
        'eng_name',
        'fin_name',
        'swe_name',
        'eng_instructions',
        'fin_instructions',
        'swe_instructions',
        'open',
        'active',
        'show_feedback',
        'course_instance_id'
      ]
    })
  },
  execute: (instance, inputs) => {
    [
      'eng_name',
      'fin_name',
      'swe_name',
      'eng_instructions',
      'fin_instructions',
      'swe_instructions',
      'open',
      'active',
      'show_feedback'
    ].forEach((field) => {
      instance[field] = inputs[field]
    })
    return instance.save()
  },
  value: instance => instance.get()
}

module.exports = {
  create,
  delete: deleteService,
  getOne,
  getData,
  edit
}
