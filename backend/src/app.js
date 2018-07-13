const express = require('express')
// const cors = require('cors')

const routes = require('./routes.js')

const lang = require('./middleware/lang.js')

const PORT = 8000
const app = express()

// app.use(cors())
app.use(express.json())

app.use(lang)

routes(app)

app.listen(PORT, () => {
  console.log(`DISA backend listening at ${PORT}`)
})

module.exports = app
