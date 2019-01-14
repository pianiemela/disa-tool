const fs = require('fs')
require('dotenv').config()

const readFile = (filename) => {
  let content
  try {
    content = fs.readFileSync(filename)
  } catch (e) {
    return null
  }
  return content
}

const samldata = {
  metadata: readFile('./samldata/metadata.xml'),
  key: readFile('./samldata/key.pem'),
  cert: readFile('./samldata/cert.pem'),
  idp_public_cert: readFile('./samldata/idp_public_cert.pem')
}

const {
  NODE_ENV,
  DB_NAME,
  TEST_DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
  DB_PORT,
  LOG_PORT,
  LOG_HOST,
  FRONTEND_LOGIN,
  ENTITY_ID,
  ASSERT_ENDPOINT,
  SSO_LOGIN_URL,
  SECRET,
  IDP_ENTITY_ID
} = process.env

module.exports = {
  LOG_PORT,
  LOG_HOST,
  dialect: 'postgres',
  username: DB_USER,
  password: DB_PASS,
  database: NODE_ENV === 'test' ? TEST_DB_NAME : DB_NAME,
  host: DB_HOST,
  port: DB_PORT,
  FRONTEND_LOGIN,
  ENTITY_ID,
  ASSERT_ENDPOINT,
  SSO_LOGIN_URL,
  SSO_LOGOUT_URL: SSO_LOGIN_URL,
  SECRET,
  IDP_ENTITY_ID,
  samldata
}
