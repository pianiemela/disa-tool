const express = require('express')
// const cors = require('cors')

const routes = require('./routes.js')

const PORT = 8000
const app = express()

// app.use(cors())
app.use(express.json())

routes(app)

app.listen(PORT, () => {
    console.log(`DISA backend listening at ${PORT}`)
})

module.exports = app
