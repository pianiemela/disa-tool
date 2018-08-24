const jwt = require('jsonwebtoken')

const checkAuth = (req) => {
  try {
    const { authorization } = req.headers
    let token
    if (!authorization) {
      return null
    }
    if (authorization.substring(0, 7) === 'Bearer ') {
      token = authorization.split(' ')[1] // eslint-disable-line
    } else {
      return null
    }
    if (!jwt.verify(token, process.env.SECRET)) {
      console.log('NOT AUTHED')
      return null
    }
    const { user } = jwt.decode(token)
    return user
  } catch (e) {
    return null
  }
}

module.exports = {
  checkAuth
}
