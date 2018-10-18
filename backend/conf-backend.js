require('dotenv').config()

const { DB_URL, TEST_DB_URL, LOG_PORT, LOG_HOST } = process.env

const development = { url: DB_URL }
const production = { url: DB_URL }
const text = { url: TEST_DB_URL }

module.exports = {
  DB_URL,
  TEST_DB_URL,
  development,
  production,
  text,
  LOG_PORT,
  LOG_HOST
}
