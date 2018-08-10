const {
  testHeaders,
  testStatusCode,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy
} = require('../testUtils')
const { CoursePerson } = require('../../database/models.js')

describe.skip('course_person_controller', () => {
  describe('POST /register', () => {
    const data = {
      course_instance_id: 4
    }
    const options = {
      route: '/api/course-persons/register',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.student}`]
      }
    }

    afterEach((done) => {
      CoursePerson.destroy({
        where: {
          course_instance_id: data.course_instance_id
        }
      }).then(() => done())
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          course_instance_id: data.course_instance_id,
          person_id: 421,
          role: 'STUDENT'
        }
      }
    })

    testDatabaseSave(
      options,
      {
        ...data,
        id: expect.any(Number),
        person_id: 421,
        role: 'STUDENT'
      },
      CoursePerson
    )
  })

  describe('POST /unregister', () => {
    const data = {
      course_instance_id: 4
    }
    const options = {
      route: '/api/course-persons/unregister',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.student}`]
      }
    }

    beforeEach((done) => {
      CoursePerson.create({
        course_instance_id: data.course_instance_id,
        person_id: 421,
        role: 'STUDENT'
      }).then(() => done())
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: expect.any(Number),
          course_instance_id: data.course_instance_id,
          person_id: 421,
          role: 'STUDENT'
        }
      }
    })

    testDatabaseDestroy(
      options,
      CoursePerson,
      {
        delay: 2000
      }
    )
  })
})
