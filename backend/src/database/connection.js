const Sequelize = require('sequelize')
const conf = require('../../conf-backend.js')
require('pg').defaults.parseInt8 = true

require('pg').defaults.parseInt8 = true

const sequelize = new Sequelize(conf.DB_URL, {
  dialect: 'postgres',
  logging: false,
  operatorsAliases: false
})

module.exports = {
  sequelize
}
