const faker = require('faker')
const { Person } = require('./models')

const yiaBoi = async () => {
  const people = await Person.findAll()
  const basenumber = 10000000
  await Promise.all(people.map((person, i) => {
    const name = `${faker.name.firstName()} ${faker.name.lastName()}`
    const username = faker.internet.userName(name)
    const studentnumber = `0${basenumber + i}`
    person.set('name', name)
    person.set('username', username)
    person.set('studentnumber', studentnumber)
    return person.save()
  }))
  process.exit()
}

yiaBoi()
console.log('It\'s ya boi')
