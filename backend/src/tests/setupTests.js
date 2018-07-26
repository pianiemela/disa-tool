const jwt = require('jsonwebtoken')
global.supertest = require('supertest')
global.app = require('../app.js')
const { Person } = require('../database/models.js')


global.tokens = {
  promise: Promise.all([
    Person.findOne({
      where: {
        studentnumber: '012345678'
      },
      attributes: ['id', 'name', 'studentnumber', 'role']
    }).then((student) => {
      global.tokens.student = jwt.sign(student.toJSON(), process.env.SECRET)
    }),
    Person.findOne({
      where: {
        studentnumber: '012345679'
      },
      attributes: ['id', 'name', 'studentnumber', 'role']
    }).then((teacher) => {
      global.tokens.teacher = jwt.sign(teacher.toJSON(), process.env.SECRET)
    })
  ])
}
