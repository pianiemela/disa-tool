const express = require('express')
const path = require('path')

const routes = require('./routes.js')

const app = express()

app.use(express.json({ limit: '1000kb' }))
app.use(express.static('dist'))

app.get('/ping', async (req, res) => {
  res.json({ data: 'pong' })
})

routes(app)

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'))
})

module.exports = app
