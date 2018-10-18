const logger = require('./utils/logger')
const app = require('./app')

const PORT = 8000

app.listen(PORT, () => {
  logger.info(`DISA backend listening at ${PORT}`)
})
