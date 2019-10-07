const { checkAuth } = require('../services/auth')

module.exports = async (req, res, next) => {
  req.user = await checkAuth(req)
  next()
}
