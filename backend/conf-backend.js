require('dotenv').config()

const DB_URL = process.env.DB_URL
const TEST_DB_URL = process.env.TEST_DB_URL

const development = { url: DB_URL }
const production = { url: DB_URL }
const text = { url: TEST_DB_URL }

module.exports = {
  DB_URL,
  TEST_DB_URL,
  development,
  production,
  text
}
