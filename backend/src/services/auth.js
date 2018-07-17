const jwt = require('jsonwebtoken')


const checkAuth = (req) => {
  const { authorization } = req.headers
  let token
  if (!authorization) {
    return null
  }
  if (authorization.substring(0, 7) === 'Bearer ') {
    token = authorization.split(' ')[1]
  } else {
    return null
  }
  if (!jwt.verify(token, process.env.SECRET)) {
    console.log('NOT AUTHED')
    return null
  }
  const { user } = jwt.decode(token)
  return user
}

module.exports = {
  checkAuth
}
