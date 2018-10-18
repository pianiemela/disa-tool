const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const conf = require('../../conf-backend.js')
require('pg').defaults.parseInt8 = true

const dbUrl = process.env.NODE_ENV === 'test' ? conf.TEST_DB_URL : conf.DB_URL

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
  operatorsAliases: false
})

const syncDatabase = async () => {
  try {
    await sequelize.sync()
    logger.info('synced database')
  } catch (e) {
    logger.error(e)
  }
}

const forceSyncDatabase = async () => {
  try {
    await sequelize.sync({ force: true })
    logger.info('forced database')
  } catch (e) {
    logger.error(e)
  }
}

module.exports = {
  sequelize,
  syncDatabase,
  forceSyncDatabase
}
