const jwt = require('jsonwebtoken')
const supertest = require('supertest') // eslint-disable-line import/no-extraneous-dependencies
const app = require('../app.js')

require('dotenv').config()

global.server = supertest(app)

global.tokens = {
  student: jwt.sign({ user: { id: 421 } }, process.env.SECRET),
  teacher: jwt.sign({ user: { id: 424 } }, process.env.SECRET),
  admin: jwt.sign({ user: { id: 423 } }, process.env.SECRET)
}

jest.setTimeout(20000)
