require('dotenv').config()

const { NODE_ENV, DB_NAME, TEST_DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT, LOG_PORT, LOG_HOST } = process.env

module.exports = {
  LOG_PORT,
  LOG_HOST,
  dialect: 'postgres',
  username: DB_USER,
  password: DB_PASS,
  database: NODE_ENV === 'test' ? TEST_DB_NAME : DB_NAME,
  host: DB_HOST,
  port: DB_PORT
}
