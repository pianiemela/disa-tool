const faker = require('faker')
const { Person, CoursePerson } = require('./models')


const createStudentsOnCourse = async (studentNumbers, courseId) => {
  console.log(`trying to create ${studentNumbers.length} students`)
  const students = await Promise.all(studentNumbers.map(async (number) => {
    const find = await Person.findOne({ where: { studentnumber: number } })
    console.log(find)
    if (find) return find
    const student = { name: faker.name.findName(), studentnumber: number, role: 'STUDENT' }
    console.log(`creating ${student.name}`)
    return Person.create(student, { returning: true }).then(res => res).catch(e => console.log('I AM DYING', e))
  }))
  console.log('--------------------------------------------------')
  console.log('starting to create course persons')
  const courseStudents = await Promise.all(students.map(async (person) => {
    const find = await CoursePerson.findOne({ where: { person_id: person.id, course_instance_id: courseId } })
    console.log(find)
    if (find) return find
    return CoursePerson.create({
      person_id: person.id, course_instance_id: courseId, role: 'STUDENT'
    }, { returning: true })
  }))
  console.log('created', courseStudents)
  console.log('DONE')
  process.exit()
}

const n = [
  '012345601',
  '012345602',
  '012345603',
  '012345604',
  '012345605',
  '012345606',
  '012345607',
  '012345608',
  '012345609',
  '012345610',
  '012345611',
  '012345612',
  '012345613',
  '012345614',
  '012345615',
  '012345616',
  '012345617',
  '012345618',
  '012345619',
  '012345620',
  '012345621',
  '012345622',
  '012345623',
  '012345624',
  '012345625',
  '012345626',
  '012345627',
  '012345628',
  '012345629',
  '012345630',
  '012345631',
  '012345632',
  '012345633',
  '012345634',
  '012345635',
  '012345636',
  '012345637',
  '012345638',
  '012345639',
  '012345640',
  '012345641',
  '012345642',
  '012345643',
  '012345644',
  '012345645',
  '012345646',
  '012345647',
  '012345648',
  '012345649',
  '012345650',
  '012345651',
  '012345652',
  '012345653',
  '012345654',
  '012345655',
  '012345656',
  '012345657',
  '012345658',
  '012345659',
  '012345660',
  '012345661',
  '012345662',
  '012345663',
  '012345664',
  '012345665',
  '012345666',
  '012345667',
  '012345668',
  '012345669',
  '012345670',
  '012345671',
  '012345672',
  '012345673',
  '012345674',
  '012345675',
  '012345676',
  '012345677',
  '012345678',
  '012345679',
  '012345680',
  '012345681',
  '012345682',
  '012345683',
  '012345684',
  '012345685',
  '012345686',
  '012345687',
  '012345688',
  '012345689',
  '012345690',
  '012345691',
  '012345692',
  '012345693',
  '012345694',
  '012345695',
  '012345696',
  '012345697',
  '012345698',
  '012345699',
  '012345700',
  '012345701',
  '012345702',
  '012345703',
  '012345704',
  '012345705',
  '012345706',
  '012345707',
  '012345708',
  '012345709',
  '012345710',
  '012345711',
  '012345712',
  '012345713',
  '012345714',
  '012345715',
  '012345716',
  '012345717'
]

createStudentsOnCourse(n, 1)
