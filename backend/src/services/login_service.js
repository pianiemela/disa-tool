const jwt = require('jsonwebtoken')
const axios = require('axios')
const https = require('https')

const { Person } = require('../database/models.js')

const messages = {
  create: {
    success: {
      eng: '"Uusi käyttäjä luotu onnistuneesti." englanniksi.',
      fin: 'Uusi käyttäjä luotu onnistuneesti.',
      swe: '"Uusi käyttäjä luotu onnistuneesti." ruotsiksi.'
    }
  },
  login: {
    success: {
      eng: '"Sisäänkirjautuminen onnistui." englanniksi.',
      fin: 'Sisäänkirjautuminen onnistui.',
      swe: '"Sisäänkirjautuminen onnistui." ruotsiksi.'
    },
    failure: {
      wrong_creds: {
        eng: '"Väärä salasana tai käyttäjänimi." englanniksi.',
        fin: 'Väärä salasana tai käyttäjänimi.',
        swe: '"Väärä salasana tai käyttäjänimi." ruotsiksi.'
      }
    }
  }
}

const login = async (body, lang) => {
  const result = await axios.post(
    `https://${process.env.KURKI_URL}/login`,
    body,
    {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }) // This is not production-ready!
      // This line makes axios accept any cert and exposes us to a man-in-the-middle attack.
      // Sending real AD credentials through this is a violation of some terms or conditions I'm sure.
    }
  )
  if (result.data.error) {
    if (result.data.error === 'wrong credentials') {
      return {
        error: messages.login.failure.wrong_creds[lang],
        status: 403
      }
    }
    return {
      error: result.data.error,
      status: 400
    }
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
      name: created.name,
      role: created.role
    }
    return {
      message: messages.create.success[lang],
      logged_in: loggedIn,
      created: true
    }
  }
  return {
    message: messages.login.success[lang],
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
