const Sequelize = require('sequelize')
const logger = require('../utils/logger')
const { database, username, password, host, port, dialect } = require('../../conf-backend.js')
require('pg').defaults.parseInt8 = true

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect,
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
