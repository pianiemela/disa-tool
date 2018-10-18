const winston = require('winston')
const Log2gelf = require('winston-log2gelf')

const { LOG_HOST, LOG_PORT } = require('../../conf-backend')

const transports = []

if (LOG_PORT && LOG_HOST) {
  transports.push(new Log2gelf({
    hostname: process.env.LOG_HOSTNAME || 'disa',
    host: LOG_HOST,
    port: LOG_PORT,
    protocol: 'http'
  }))
}

if (process.env.NODE_ENV !== 'test') {
  transports.push(new winston.transports.File({ filename: 'debug.log' }))
}

transports.push(new winston.transports.Console({ level: 'debug' }))

const logger = winston.createLogger({ transports, exitOnError: false })

module.exports = logger
