const Sequelize = require('sequelize')
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
    console.log('synced database')
  } catch (e) {
    console.log(e)
  }
}

const forceSyncDatabase = async () => {
  try {
    await sequelize.sync({ force: true })
    console.log('forced database')
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  sequelize,
  syncDatabase,
  forceSyncDatabase
}
