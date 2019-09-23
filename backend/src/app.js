const express = require('express')
const path = require('path')
const Sentry = require('@sentry/node')
const bodyParser = require('body-parser')
const logger = require('./utils/logger')
const routes = require('./routes.js')

const app = express()

Sentry.config(process.env.SENTRY_ADDR).install()

app.use(express.json({ limit: '1000kb' }))
app.use(express.static('dist'))
// Parse saml requests.
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/ping', async (req, res) => {
  res.json({ data: 'pong' })
})

routes(app)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'))
})

app.use(Sentry.errorHandler())

app.use((err, req, res, next) => {
  logger.error('Request error', {
    error: err.message,
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    stack: err.stack
  })
  res.status(500).send('Error')
  next()
})

process.on('unhandledRejection', (reason, p) => {
  logger.error('Unhandled Rejection at: Promise', { promise: p, reason, stack: reason.stack })
  // application specific logging, throwing an error, or other logic here
})

module.exports = app
