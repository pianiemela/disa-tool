require('dotenv').config()

const DB_URL = process.env.DB_URL
const TEST_DB_URL = process.env.TEST_DB_URL

module.exports = {
  DB_URL,
  TEST_DB_URL
}
