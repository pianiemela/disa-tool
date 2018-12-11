const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = require('../../conf-backend.js')
require('pg').defaults.parseInt8 = true

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
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
