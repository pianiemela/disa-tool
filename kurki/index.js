const express = require('express')
const Sequelize = require('sequelize')
require('pg').defaults.parseInt8 = true
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_URL, {
  dialect: 'postgres',
  logging: false,
  operatorsAliases: false
})

const Person = sequelize.define('person', {
  id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
  studentnumber: { type: Sequelize.STRING },
  name: { type: Sequelize.STRING },
  role: { type: Sequelize.STRING }
},
{
  tableName: 'person',
  underscored: true,
  timestamps: true
})

const app = express()
app.use(express.json())


app.post('/login', async (req, res) => {
  console.log('someone is calling: ', req.body.username)
  const errorMessage = {
    "error": "wrong credentials"
  }
  if (req.body.password === "password") {
    const user = await Person.findById(req.body.username)
    if (user) {
      const name = user.name.split(' ')
      res.json({
        username: user.id,
        student_number: user.studentnumber,
        first_names: name[0],
        last_name: name[name.length - 1]
      })
    } else {
      res.json(errorMessage);
    }
  } else {
    res.json(errorMessage)
  }
})

app.listen(3002, () => console.log('FAKE Kurki, at your service at port 3002'))
