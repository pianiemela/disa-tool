const winston = require('winston')
const Log2gelf = require('winston-log2gelf')

const { LOG_HOST, LOG_PORT, NODE_ENV } = require('../../conf-backend')

const transports = []

if (NODE_ENV !== 'test') {
  if (LOG_PORT && LOG_HOST) {
    transports.push(new Log2gelf({
      hostname: process.env.LOG_HOSTNAME || 'disa',
      host: LOG_HOST,
      port: LOG_PORT,
      protocol: 'http'
    }))
  }
  transports.push(new winston.transports.File({ filename: 'debug.log' }))
}

const consoleLevel = NODE_ENV !== 'test' ? 'debug' : 'error'
transports.push(new winston.transports.Console({ level: consoleLevel }))

const logger = winston.createLogger({ transports, exitOnError: false })

module.exports = logger
