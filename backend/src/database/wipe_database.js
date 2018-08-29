const { sequelize } = require('./connection')
const { Course } = require('./models')

sequelize.sync({ force: true }).then(async () => {
  console.log(await Course.findAll())
  process.exit()
}).catch(e => console.log(e))
