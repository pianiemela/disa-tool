const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const app = require('../app.js')

global.server = supertest(app)


global.tokens = {
  student: jwt.sign({ user: { id: 421 } }, process.env.SECRET),
  teacher: jwt.sign({ user: { id: 424 } }, process.env.SECRET)
}
