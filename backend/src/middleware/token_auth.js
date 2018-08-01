const { checkAuth } = require('../services/auth')

module.exports = (req, res, next) => {
  req.user = checkAuth(req)
  next()
}
