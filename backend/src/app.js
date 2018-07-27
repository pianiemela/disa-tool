const express = require('express')
const path = require('path')
// const cors = require('cors')
const bodyParser = require('body-parser')

const routes = require('./routes.js')

const app = express()

// app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(bodyParser.json())

app.get('/ping', async (req, res) => {
  res.json({ data: 'pong' })
})

routes(app)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'))
})

module.exports = app
