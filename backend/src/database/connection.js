const Sequelize = require('sequelize')
const conf = require('../../conf-backend.js')
require('pg').defaults.parseInt8 = true

const dbUrl = process.env.NODE_ENV === 'test' ? conf.TEST_DB_URL : conf.DB_URL

const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  logging: false,
  operatorsAliases: false
})

module.exports = {
  sequelize
}
