const personService = require('./person_service')


const checkAuth = async (req) => {
  const token = req.headers['x-access-token']
  console.log(token)
  //   if (!jwt.verify(token, process.env.SECRET)) {
  //     console.log('NOT AUTHED')
  //     return null
  //   }
  //   const { user } = jwt.decode(token)
  return personService.getUser(1)
}

module.exports = {
  checkAuth
}
