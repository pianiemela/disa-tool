const Sequelize = require('sequelize')
const conf = require('../../conf-backend.js')

const sequelize = new Sequelize(conf.DB_URL, {
  dialect: 'postgres',
  logging: false,
  operatorsAliases: false
})

module.exports = {
  sequelize
}
