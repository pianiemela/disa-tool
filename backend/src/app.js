const express = require('express')

const PORT = 8000
const app = express()


app.listen(PORT, () => {
    console.log(`DISA backend listening at ${PORT}`)
})

module.exports = app
