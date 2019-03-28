const router = require('express').Router()
const {
  FinalGradeResponse,
  OpenResponse,
  CategoryResponse,
  ObjectiveResponse
} = require('../database/models')
const responseModuleCRUD = require('../utils/responseModuleCRUD')

const messages = {
  create: {
    eng: '',
    fin: '',
    swe: ''
  },
  getByResponse: {
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

responseModuleCRUD(router, {
  model: FinalGradeResponse,
  route: '/final-grade-response',
  messages
})
responseModuleCRUD(router, {
  model: OpenResponse,
  route: '/open-response',
  messages
})
responseModuleCRUD(router, {
  model: CategoryResponse,
  route: '/category-response',
  messages
})
responseModuleCRUD(router, {
  model: ObjectiveResponse,
  route: '/objective-response',
  messages
})

module.exports = router
