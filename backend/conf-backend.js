require('dotenv').config()

const { NODE_ENV, DB_NAME, TEST_DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT, LOG_PORT, LOG_HOST } = process.env

module.exports = {
  DB_NAME: NODE_ENV === 'test' ? TEST_DB_NAME : DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT,
  LOG_PORT,
  LOG_HOST
}
