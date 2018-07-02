const Sequelize = require('sequelize')
const { sequelize } = require('./connection.js')

const Task = sequelize.define('task', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true }
}, {
  tableName: 'task',
  underscored: true,
  timestamps: true
})

module.exports = {
  Task
}