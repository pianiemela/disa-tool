const router = require('express').Router()
const {
  FinalGradeQuestion,
  OpenQuestion,
  CategoryQuestion,
  ObjectiveQuestion
} = require('../database/models')
const questionModuleCRUD = require('../utils/questionModuleCRUD')

const messages = {
  create: {
    eng: '',
    fin: '',
    swe: ''
  },
  findBySelfAssessmentForm: {
    eng: '',
    fin: '',
    swe: ''
  },
  edit: {
    eng: '',
    fin: '',
    swe: ''
  },
  delete: {
    eng: '',
    fin: '',
    swe: ''
  }
}

questionModuleCRUD(router, {
  model: FinalGradeQuestion,
  route: '/final-grade-question',
  messages
})
questionModuleCRUD(router, {
  model: OpenQuestion,
  route: '/open-question',
  messages
})
questionModuleCRUD(router, {
  model: CategoryQuestion,
  route: '/category-question',
  messages
})
questionModuleCRUD(router, {
  model: ObjectiveQuestion,
  route: '/objective-question',
  messages
})

module.exports = router
