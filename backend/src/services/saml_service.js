const jwt = require('jsonwebtoken')
const axios = require('axios')
const { Op } = require('sequelize')
const { parseString, Builder } = require('xml2js')
const { Person } = require('../database/models')
const config = require('../../conf-backend')

const builder = new Builder()

const JWT_OPTIONS = {
  expiresIn: '24h'
}

const getMetadata = entityId => new Promise((resolve) => {
  axios.get(entityId).then((response) => {
    parseString(response.data, (error, result) => {
      let parsed = result
      if (result.EntitiesDescriptor) {
        parsed = {
          EntityDescriptor: result.EntitiesDescriptor.EntityDescriptor.find((
            descriptor => descriptor.IDPSSODescriptor
          ))
        }
      }
      const built = builder.buildObject(parsed)
      resolve(built)
    })
  })
})

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

const findOrCreateUser = async (user) => {
  const person = await Person.findOne({
    where: {
      university: user.university,
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
      role: 'STUDENT',
      university: user.university
    })
    const loggedIn = {
      id: created.id,
      username: created.username,
      studentnumber: created.studentnumber,
      name: created.name,
      role: created.role,
      university: created.university
    }
    return {
      logged_in: loggedIn,
      created: true
    }
  } if (person.name !== user.name) {
    person.set('name', user.name)
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
    name: protoUser.displayName,
    username: protoUser.eduPersonPrincipalName.split('@')[0],
    studentnumber: protoUser.schacPersonalUniqueCode.split(':').pop(),
    university: protoUser.schacHomeOrganization
  }
  const user = await findOrCreateUser(protoUser)
  return jwt.sign({ user: user.logged_in }, config.SECRET, JWT_OPTIONS)
}
const responseUrl = token => applyParam(config.FRONTEND_LOGIN, 'token', token)

const samlResponseAttributes = {
  displayName: 'urn:oid:2.16.840.1.113730.3.1.241',
  eduPersonPrincipalName: 'urn:oid:1.3.6.1.4.1.5923.1.1.1.6',
  schacHomeOrganization: 'urn:oid:1.3.6.1.4.1.25178.1.2.9',
  schacPersonalUniqueCode: 'urn:oid:1.3.6.1.4.1.25178.1.2.14'
}

module.exports = {
  getMetadata,
  signToken,
  responseUrl
}
