const logger = require('../utils/logger')
const { sequelize } = require('./connection')
const { Course } = require('./models')

sequelize.sync({ force: true }).then(async () => {
  logger.crit(await Course.findAll())
  process.exit()
}).catch(e => logger.error(e))
