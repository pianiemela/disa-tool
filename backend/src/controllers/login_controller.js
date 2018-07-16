const router = require('express').Router()
const jwt = require('jsonwebtoken')
const axios = require('axios')
const https = require('https')

const { Person } = require('../database/models.js')

const messages = {
  create: {
    success: {
      eng: '',
      fin: '',
      swe: ''
    }
  },
  login: {
    success: {
      eng: '',
      fin: '',
      swe: ''
    }
  }
}

router.post('', async (req, res) => {
  const result = await axios.post(`https://${process.env.KURKI_URL}/login`, {
    username: req.body.username,
    password: req.body.password
  },
  {
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    }) // This is not production-ready!
    // This line makes axios accept any cert and exposes us to a man-in-the-middle attack.
    // Sending real AD credentials through this is a violation of some terms or conditions I'm sure.
  })
  if (result.data.error) {
    res.status(403).json({
      error: result.data.error
    })
    return
  }
  const person = await Person.findOne({
    where: {
      studentnumber: result.data.student_number
    },
    attributes: ['id', 'name', 'studentnumber', 'role']
  })
  if (!person) {
    const created = await Person.create({
      studentnumber: result.data.student_number,
      name: `${result.data.first_names.includes('*') ? (
        result.data.first_names.split('*')[1].split(' ')[0]
      ) : (
        result.data.first_names.split(' ')[0]
      )} ${result.data.last_name}`,
      role: 'student'
    })
    const loggedIn = {
      id: created.id,
      studentnumber: created.studentnumber,
      name: created.studentnumber,
      role: created.role
    }
    res.status(200).json({
      message: messages.create.success[req.lang],
      logged_in: loggedIn,
      created: true
    })
    return
  }
  res.status(200).json({
    message: messages.login.success[req.lang],
    logged_in: person.toJSON(),
    created: false
  })
})

module.exports = router
