const {
  testHeaders,
  testStatusCode,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testAdminPrivilege,
  testTeacherOnCoursePrivilege
} = require('../testUtils')
const { CoursePerson, Person } = require('../../database/models.js')
const { messages } = require('../../messages/global.js')

describe('course_person_controller', () => {
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
          course_instance_id: data.course_instance_id,
          person_id: 421
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
      }).then(() => done()).catch(done)
    })

    afterEach((done) => {
      CoursePerson.destroy({
        where: {
          course_instance_id: data.course_instance_id,
          person_id: 421
        }
      }).then(() => done()).catch(done)
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

  describe('PUT /course-role', () => {
    const coursePersonData = {
      role: 'STUDENT',
      course_instance_id: 1
    }
    const data = {
      role: 'TEACHER',
      courseInstanceId: coursePersonData.course_instance_id
    }

    const options = {
      route: '/api/course-persons/course-role',
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.admin}`]
      }
    }

    const ids = {}

    beforeAll((done) => {
      Person.create({
        role: 'STUDENT',
        name: 'p',
        university: 'helsinki.fi',
        studentnumber: '011111111'
      }).then((person) => {
        ids.person = person.id
        data.personId = person.id
        done()
      }).catch(done)
    })

    afterEach((done) => {
      CoursePerson.destroy({
        where: {
          person_id: ids.person,
          course_instance_id: coursePersonData.course_instance_id
        }
      }).then(() => done()).catch(done)
    })

    afterAll((done) => {
      Person.destroy({
        where: {
          id: ids.person
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testAdminPrivilege(options)

    testBody(options, {
      common: {
        data: {
          id: expect.any(Number),
          person_id: asymmetricMatcher(actual => actual === ids.person),
          course_instance_id: coursePersonData.course_instance_id,
          role: data.role
        }
      },
      eng: {
        message: messages.create.eng
      },
      fin: {
        message: messages.create.fin
      },
      swe: {
        message: messages.create.swe
      }
    })

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        person_id: asymmetricMatcher(actual => actual === ids.person),
        course_instance_id: coursePersonData.course_instance_id,
        role: data.role
      },
      CoursePerson,
      {
        pathToId: ['body', 'data', 'id']
      }
    )

    describe('when course_person already exist', () => {
      beforeEach((done) => {
        CoursePerson.create({
          ...coursePersonData,
          person_id: ids.person
        }).then((coursePerson) => {
          ids.coursePerson = coursePerson.id
          done()
        }).catch(done)
      })

      afterAll((done) => {
        CoursePerson.destroy({
          where: {
            id: ids.coursePerson
          }
        }).then(() => done()).catch(done)
      })

      testBody(options, {
        common: {
          data: {
            id: asymmetricMatcher(actual => actual === ids.coursePerson),
            person_id: asymmetricMatcher(actual => actual === ids.person),
            course_instance_id: coursePersonData.course_instance_id,
            role: data.role
          }
        },
        eng: {
          message: messages.update.eng
        },
        fin: {
          message: messages.update.fin
        },
        swe: {
          message: messages.update.swe
        }
      })

      testDatabaseSave(
        options,
        {
          id: asymmetricMatcher(actual => actual === ids.coursePerson),
          person_id: asymmetricMatcher(actual => actual === ids.person),
          course_instance_id: coursePersonData.course_instance_id,
          role: data.role
        },
        CoursePerson,
        {
          pathToId: ['body', 'data', 'id']
        }
      )
    })

    describe('responds with an error code when', () => {
      describe('when person does not exist', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble.send = {
            ...data,
            personId: 999999
          }
        })

        testStatusCode(derivativeOptions, 404)
      })

      describe('when course instance does not exist', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble.send = {
            ...data,
            courseInstanceId: 999999
          }
        })

        testStatusCode(derivativeOptions, 404)
      })
    })
  })

  describe('POST /delete', () => {
    const coursePersonData = {
      course_instance_id: 1,
      role: 'STUDENT'
    }
    const data = {
      course_instance_id: coursePersonData.course_instance_id
    }

    const options = {
      route: '/api/course-persons/delete',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    const ids = {}

    beforeAll((done) => {
      Person.create({
        role: 'STUDENT',
        name: 'p',
        university: 'helsinki.fi',
        studentnumber: '011111111'
      }).then((person) => {
        ids.person = person.id
        data.id = person.id
        done()
      }).catch(done)
    })

    beforeEach((done) => {
      CoursePerson.create({
        ...coursePersonData,
        person_id: ids.person
      }).then((coursePerson) => {
        ids.coursePerson = coursePerson.id
        done()
      }).catch(done)
    })

    afterEach((done) => {
      CoursePerson.destroy({
        where: {
          person_id: ids.person,
          course_instance_id: coursePersonData.course_instance_id
        }
      }).then(() => done()).catch(done)
    })

    afterAll((done) => {
      Person.destroy({
        where: {
          id: ids.person
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          ...coursePersonData,
          id: asymmetricMatcher(actual => actual === ids.coursePerson),
          person_id: asymmetricMatcher(actual => actual === ids.person)
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

    describe('responds with an error code when', () => {
      describe('when person is not registered', () => {
        beforeEach((done) => {
          CoursePerson.destroy({
            where: {
              person_id: ids.person,
              course_instance_id: coursePersonData.course_instance_id
            }
          }).then(() => done()).catch(done)
        })

        testStatusCode(options, 404)
      })

      describe('when person does not exist', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble.send = {
            ...data,
            id: 999999
          }
        })

        testStatusCode(derivativeOptions, 404)
      })

      describe('when input values are missing', () => {
        const derivativeOptions = [
          { ...options },
          { ...options }
        ]
        beforeAll(() => {
          delete derivativeOptions[0].preamble.send.id
          delete derivativeOptions[1].preamble.send.course_instance_id
        })

        testStatusCode(derivativeOptions[0], 400)
        testStatusCode(derivativeOptions[1], 400)
      })
    })
  })
})
