const jwt = require('jsonwebtoken')
const axios = require('axios')
const https = require('https')
const fs = require('fs')
const { Op } = require('sequelize')
const config = require('../../conf-backend')

const { Person } = require('../database/models.js')

const cert = process.env.KURKI_CERT ? fs.readFileSync(process.env.KURKI_CERT) : null
let httpsAgent
if (cert) {
  httpsAgent = new https.Agent({ ca: cert })
} else {
  httpsAgent = new https.Agent({ rejectUnauthorized: false })
  console.warn('No file path set for Kurki api certificate. Set it in .env as KURKI_CERT.')
}

const login = async (body) => {
  const result = await axios.post(
    `${process.env.KURKI_URL}/login`,
    body, {
      httpsAgent
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

const shibbolethlogin = async ({ displayname, schacpersonaluniquecode, uid }) => { // , employeenumber
  const studentnumber = schacpersonaluniquecode && schacpersonaluniquecode.length !== 0
    ? schacpersonaluniquecode.split(':')[6]
    : null
  const person = await Person.findOne({
    where: {
      [Op.or]: [
        { username: uid },
        { studentnumber }
      ]
    },
    attributes: ['id', 'username', 'name', 'studentnumber', 'role']
  })
  if (!person) {
    const created = await Person.create({
      username: uid,
      studentnumber,
      name: displayname,
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
  }
  return {
    logged_in: person.toJSON(),
    created: false
  }
}

const signJWT = user => jwt.sign({ user }, config.SECRET)

module.exports = {
  shibbolethlogin,
  login,
  signJWT
}
