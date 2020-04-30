const winston = require('winston')
const Log2gelf = require('winston-log2gelf')

const { LOG_HOSTNAME, LOG_HOST, LOG_PORT, NODE_ENV, LOG_PROTOCOL, LOG_PATH } = require('../../conf-backend')

const transports = []

if (NODE_ENV !== 'test') {
  if (LOG_PORT && LOG_HOST) {
    transports.push(new Log2gelf({
      hostname: LOG_HOSTNAME || 'disa',
      host: LOG_HOST,
      port: LOG_PORT,
      protocol: LOG_PROTOCOL || 'https',
      environment: NODE_ENV,
      protocolOptions: {
        path: LOG_PATH || '/gelf'
      }
    }))
  }
  transports.push(new winston.transports.File({ filename: 'debug.log' }))
}

const consoleLevel = NODE_ENV !== 'test' ? 'debug' : 'error'
transports.push(new winston.transports.Console({ level: consoleLevel }))

const logger = winston.createLogger({ transports, exitOnError: false })

module.exports = logger
