const jwt = require('jsonwebtoken')
const axios = require('axios')
const { Op } = require('sequelize')
const { Person } = require('../database/models')
const config = require('../../conf-backend')

const JWT_OPTIONS = {
  expiresIn: '24h'
}

const getMetadata = async (entityId) => {
  const response = await axios.get(entityId)
  return response.data
}

const parseUser = attributes => Object.keys(samlResponseAttributes).reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: attributes[samlResponseAttributes[curr]]
  }),
  {}
)

const applyParam = (url, key, value) => {
  const paramChar = url.includes('?') ? '&' : '?'
  return `${url}${paramChar}${key}=${value}`
}

const parseStudentNumber = user => (
  user.schacPersonalUniqueCode.split(':').pop()
)
const findOrCreateUser = async (user) => {
  const person = await Person.findOne({
    where: {
      [Op.or]: [
        { username: user.username },
        { studentnumber: user.studentnumber }
      ]
    },
    attributes: ['id', 'username', 'name', 'studentnumber', 'role']
  })
  if (!person) {
    const created = await Person.create({
      username: user.username,
      studentnumber: user.studentnumber,
      name: user.name,
      role: 'STUDENT'
    })
    const loggedIn = {
      id: created.id,
      username: created.username,
      studentnumber: created.studentnumber,
      name: created.name,
      role: created.role
    }
    return {
      logged_in: loggedIn,
      created: true
    }
  } if (person.name !== user.name) {
    person.set('name', user.cn)
    person.set('username', user.username)
    await person.save()
  }
  return {
    logged_in: person.toJSON(),
    created: false
  }
}
const signToken = async (response) => {
  const { attributes } = response.extract
  let protoUser = parseUser(attributes)
  protoUser = {
    name: `${protoUser.displayName} ${protoUser.cn.split(' ').pop()}`,
    username: protoUser.eduPersonPrincipalName.split('@')[0],
    studentnumber: parseStudentNumber(protoUser)
  }
  const user = await findOrCreateUser(protoUser)
  return jwt.sign(user, config.SECRET, JWT_OPTIONS)
}
const responseUrl = token => applyParam(config.FRONTEND_LOGIN, 'token', token)

const samlResponseAttributes = {
  cn: 'urn:oid:2.5.4.3',
  displayName: 'urn:oid:2.16.840.1.113730.3.1.241',
  eduPersonPrincipalName: 'urn:oid:1.3.6.1.4.1.5923.1.1.1.6',
  mail: 'urn:oid:0.9.2342.19200300.100.1.3',
  schacHomeOrganization: 'urn:oid:1.3.6.1.4.1.25178.1.2.9',
  schacPersonalUniqueCode: 'urn:oid:1.3.6.1.4.1.25178.1.2.14',
}

module.exports = {
  getMetadata,
  signToken,
  responseUrl
}
