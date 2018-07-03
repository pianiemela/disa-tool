const { sequelize } = require('./connection.js')
const { Task } = require('./models.js')


const run = async () => {
    await sequelize.sync({ force: true })
    console.log('forced')
    Task.create()
}

run()
