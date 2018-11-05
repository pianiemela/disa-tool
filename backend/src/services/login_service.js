const jwt = require('jsonwebtoken')
const axios = require('axios')
const https = require('https')
const { Op } = require('sequelize')

const { Person } = require('../database/models.js')

const login = async (body) => {
  const result = await axios.post(
    `${process.env.KURKI_URL}/login`,
    body, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false // This is supposedly fine for this server.
      })
    }).catch(() => ({ data: { error: 'connection_prob' } }))
  if (result.data.error) {
    if (result.data.error === 'wrong credentials') {
      return {
        error: 'wrong_creds'
      }
    }
    return {
      error: result.data.error,
      status: 400
    }
  }
  const person = await Person.findOne({
    where: {
      [Op.or]: [
        { username: result.data.username },
        { studentnumber: result.data.student_number }
      ]
    },
    attributes: ['id', 'username', 'name', 'studentnumber', 'role']
  })
  if (!person) {
    const created = await Person.create({
      username: result.data.username,
      studentnumber: result.data.student_number,
      name: `${result.data.first_names.includes('*') ? (
        result.data.first_names.split('*')[1].split(' ')[0]
      ) : (
        result.data.first_names.split(' ')[0]
      )} ${result.data.last_name}`,
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
  } if (person.name === 'NOT REGISTERED') {
    person.set('name', `${result.data.first_names.includes('*') ? (
      result.data.first_names.split('*')[1].split(' ')[0]
    ) : (
      result.data.first_names.split(' ')[0]
    )} ${result.data.last_name}`)
    person.set('username', result.data.username)
    await person.save()
  }
  return {
    logged_in: person.toJSON(),
    created: false
  }
}

const signJWT = (user) => {
  const token = jwt.sign({ user }, process.env.SECRET)
  return token
}

module.exports = {
  login,
  signJWT
}
