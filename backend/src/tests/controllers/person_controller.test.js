const { Op } = require('sequelize')
const {
  testHeaders,
  testBody,
  testStatusCode,
  testAdminPrivilege,
  asymmetricMatcher,
  testTeacherOnCoursePrivilege,
  testDatabaseSave,
  testGlobalTeacherPrivilege
} = require('../testUtils.js')
const { Person, CourseInstance, CoursePerson, Task, TaskResponse } = require('../../database/models.js')

describe('person_controller', () => {
  describe('GET /user', () => {
    const options = {
      route: '/api/persons/user',
      method: 'get',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.student}`]
      }
    }

    testHeaders(options)

    testStatusCode(options, 200)

    testBody(options, {
      common: {
        id: 421
      }
    })

    const derivativeOptions = { ...options, preamble: {} }

    testStatusCode(derivativeOptions, 204)
  })

  describe('POST /users', () => {
    const personData = {
      name: 'searchforme',
      studentnumber: '111111111',
      role: 'STUDENT',
      university: 'helsinki.fi'
    }
    const courseInstanceData = {
      course_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn'
    }
    const coursePersonData = {
      role: 'STUDENT'
    }
    const data = {
      studentInfo: 'search term',
      getAll: false
    }

    const options = {
      route: '/api/persons/users',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.admin}`]
      }
    }

    const ids = {}
    const expectations = {}

    beforeAll((done) => {
      Promise.all([
        Person.create(personData),
        CourseInstance.create(courseInstanceData)
      ]).then(([person, courseInstance]) => {
        ids.person = person.id
        ids.courseInstance = courseInstance.id
        Promise.all([
          CoursePerson.create({
            ...coursePersonData,
            course_instance_id: courseInstance.id,
            person_id: person.id
          }),
          Person.findAndCountAll()
        ]).then(([coursePerson, peopleCount]) => {
          expectations.peopleCount = peopleCount.count
          ids.coursePerson = coursePerson.id
          done()
        })
      }).catch(done)
    })

    testHeaders(options)

    testAdminPrivilege(options)

    const matcher = {
      eng: [{
        ...personData,
        id: asymmetricMatcher(actual => actual === ids.person),
        course_people: [{
          ...coursePersonData,
          id: asymmetricMatcher(actual => actual === ids.coursePerson),
          course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance),
          person_id: asymmetricMatcher(actual => actual === ids.person),
          course_instance: {
            name: courseInstanceData.eng_name
          }
        }]
      }],
      fin: [{
        ...personData,
        id: asymmetricMatcher(actual => actual === ids.person),
        course_people: [{
          ...coursePersonData,
          id: asymmetricMatcher(actual => actual === ids.coursePerson),
          course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance),
          person_id: asymmetricMatcher(actual => actual === ids.person),
          course_instance: {
            name: courseInstanceData.fin_name
          }
        }]
      }],
      swe: [{
        ...personData,
        id: asymmetricMatcher(actual => actual === ids.person),
        course_people: [{
          ...coursePersonData,
          id: asymmetricMatcher(actual => actual === ids.coursePerson),
          course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance),
          person_id: asymmetricMatcher(actual => actual === ids.person),
          course_instance: {
            name: courseInstanceData.swe_name
          }
        }]
      }]
    }

    describe('when searching by name', () => {
      const derivativeOptions = { ...options }
      beforeAll(() => {
        derivativeOptions.preamble.send = {
          ...data,
          studentInfo: personData.name.substring(1, personData.name.length - 1)
        }
      })
      testBody(
        derivativeOptions,
        matcher
      )
    })

    describe('when searching by studentnumber', () => {
      const derivativeOptions = { ...options }
      beforeAll(() => {
        derivativeOptions.preamble.send = {
          ...data,
          studentInfo: personData.studentnumber
        }
      })
      testBody(
        derivativeOptions,
        matcher
      )
    })

    describe('when getting all', () => {
      const derivativeOptions = { ...options }
      beforeAll(() => {
        derivativeOptions.preamble.send = {
          ...data,
          getAll: true
        }
      })
      testBody(
        derivativeOptions,
        {
          common: asymmetricMatcher(actual => actual.length === expectations.peopleCount)
        },
        {
          do_not_spread: true,
          matcher: 'toEqual'
        }
      )
    })
  })

  describe('POST /course_role', () => {
    const personData = {
      name: 'pn',
      studentnumber: '011111111',
      role: 'STUDENT',
      university: 'helsinki.fi'
    }
    const courseInstanceData = {
      course_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn'
    }
    const coursePersonData = {
      role: 'STUDENT'
    }
    const taskData = {
      eng_name: 'te',
      fin_name: 'tf',
      swe_name: 'ts',
      eng_description: 'tde',
      fin_description: 'tdf',
      swe_description: 'tds',
      info: 'test info',
      max_points: 3,
      order: 1
    }
    const taskResponseData = {
      points: 2
    }
    const data = [
      {
        role: 'TEACHER'
      },
      {
        role: 'TEACHER'
      }
    ]

    const options = {
      route: '/api/persons/course_role',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      },
      do_not_spread: ['send']
    }

    const ids = {}
    const expectations = {}

    beforeAll((done) => {
      Promise.all([
        CourseInstance.create(courseInstanceData),
        Person.create(personData),
        Person.create(personData)
      ]).then(([courseInstance, person0, person1]) => {
        ids.courseInstance = courseInstance.id
        data[0].course_instance_id = courseInstance.id
        data[1].course_instance_id = courseInstance.id
        expectations.courseInstance = courseInstance
        ids.person = [person0.id, person1.id]
        data[0].person_id = person0.id
        data[1].person_id = person1.id
        expectations.person = [person0, person1]
        Promise.all([
          CoursePerson.create({
            ...coursePersonData,
            course_instance_id: courseInstance.id,
            person_id: person0.id
          }),
          CoursePerson.create({
            course_instance_id: courseInstance.id,
            person_id: 424,
            role: 'TEACHER'
          }),
          Task.create({
            ...taskData,
            course_instance_id: courseInstance.id
          })
        ]).then(([coursePerson, teacherRole, task]) => {
          ids.coursePerson = coursePerson.id
          expectations.coursePerson = coursePerson
          ids.teacherRole = teacherRole.id
          ids.task = task.id
          TaskResponse.create({
            ...taskResponseData,
            task_id: task.id,
            person_id: person1.id
          }).then((taskResponse) => {
            ids.taskResponse = taskResponse.id
            expectations.taskResponse = taskResponse
            done()
          }).catch(done)
        }).catch(done)
      }).catch(done)
    })

    afterEach((done) => {
      Promise.all([
        CoursePerson.update(coursePersonData, {
          where: {
            id: ids.coursePerson
          }
        }),
        CoursePerson.destroy({
          where: {
            course_instance_id: ids.courseInstance,
            person_id: ids.person[1]
          }
        })
      ]).then(() => {
        expectations.coursePerson.updated_at = new Date()
        done()
      }).catch(done)
    })

    afterAll((done) => {
      Promise.all([
        CourseInstance.destroy({
          where: {
            id: ids.courseInstance
          }
        }),
        Person.destroy({
          where: {
            id: {
              [Op.in]: ids.person
            }
          }
        })
      ]).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        updatedPeople: [{
          id: asymmetricMatcher(actual => actual === ids.coursePerson),
          course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance),
          person_id: asymmetricMatcher(actual => actual === ids.person[0]),
          role: data[0].role,
          created_at: asymmetricMatcher(actual => !(
            new Date(actual) < expectations.coursePerson.created_at
            || new Date(actual) > expectations.coursePerson.created_at
          )),
          updated_at: asymmetricMatcher(actual => new Date(actual) > expectations.coursePerson.updated_at)
        }],
        newPeople: [{
          ...personData,
          id: asymmetricMatcher(actual => actual === ids.person[1]),
          created_at: asymmetricMatcher(actual => !(
            new Date(actual) < expectations.person[1].created_at || new Date(actual) > expectations.person[1].created_at
          )),
          updated_at: asymmetricMatcher(actual => !(
            new Date(actual) < expectations.person[1].updated_at || new Date(actual) > expectations.person[1].updated_at
          )),
          course_instances: [{
            ...courseInstanceData,
            id: asymmetricMatcher(actual => actual === ids.courseInstance),
            created_at: asymmetricMatcher(actual => !(
              new Date(actual) < expectations.courseInstance.created_at
              || new Date(actual) > expectations.courseInstance.created_at
            )),
            updated_at: asymmetricMatcher(actual => !(
              new Date(actual) < expectations.courseInstance.updated_at
              || new Date(actual) > expectations.courseInstance.updated_at
            ))
          }],
          task_responses: [{
            ...taskResponseData,
            id: asymmetricMatcher(actual => actual === ids.taskResponse),
            task_id: asymmetricMatcher(actual => actual === ids.task),
            person_id: asymmetricMatcher(actual => actual === ids.person[1]),
            created_at: asymmetricMatcher(actual => !(
              new Date(actual) < expectations.taskResponse.created_at
              || new Date(actual) > expectations.taskResponse.created_at
            )),
            updated_at: asymmetricMatcher(actual => !(
              new Date(actual) < expectations.taskResponse.updated_at
              || new Date(actual) > expectations.taskResponse.updated_at
            ))
          }]
        }]
      }
    })

    testDatabaseSave(
      options,
      {
        id: asymmetricMatcher(actual => actual === ids.coursePerson),
        course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance),
        person_id: asymmetricMatcher(actual => actual === ids.person[0]),
        role: data[0].role,
        created_at: asymmetricMatcher(actual => !(
          actual < expectations.coursePerson.created_at || actual > expectations.coursePerson.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > expectations.coursePerson.updated_at)
      },
      CoursePerson,
      {
        pathToId: ['body', 'updatedPeople', 0, 'id'],
        text: 'updates a row in the database.'
      }
    )

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance),
        person_id: asymmetricMatcher(actual => actual === ids.person[1]),
        role: data[1].role,
        created_at: expect.any(Date),
        updated_at: expect.any(Date)
      },
      CoursePerson,
      {
        findBy: () => ({
          where: {
            person_id: ids.person[1],
            course_instance_id: ids.courseInstance
          }
        })
      }
    )

    describe('responds with an error code when', () => {
      describe('one of the specified people doesn\'t exist', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble.send[0].person_id = 999999
        })
        testStatusCode(derivativeOptions, 500)
      })

      describe('one of the specified course instances is outside authority', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble.send[0].course_instance_id = 999999
        })
        testStatusCode(derivativeOptions, 403)
      })
    })
  })

  describe('PUT /global-role', () => {
    const personData = {
      name: 'pn',
      studentnumber: '011111111',
      role: 'STUDENT',
      university: 'helsinki.fi'
    }
    const data = {
      role: 'TEACHER'
    }

    const options = {
      route: '/api/persons/global-role',
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.admin}`]
      }
    }

    const ids = {}
    const expectations = {}

    beforeAll((done) => {
      Person.create(personData).then((person) => {
        data.personId = person.id
        ids.person = person.id
        expectations.person = person
        done()
      }).catch(done)
    })

    afterEach((done) => {
      Person.update(personData, {
        where: {
          id: ids.person
        }
      }).then(() => {
        expectations.person.updated_at = new Date()
        done()
      }).catch(done)
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
        message: expect.any(String),
        data: {
          ...personData,
          role: data.role,
          id: asymmetricMatcher(actual => actual === ids.person)
        }
      }
    })

    testDatabaseSave(
      options,
      {
        ...personData,
        role: data.role,
        id: asymmetricMatcher(actual => actual === ids.person),
        created_at: asymmetricMatcher(actual => !(
          actual < expectations.person.created_at || actual > expectations.person.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > expectations.person.updated_at)
      },
      Person,
      {
        pathToId: ['body', 'data', 'id']
      }
    )

    describe('responds with an error code when', () => {
      describe('the specified person doesn\'t exist', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble.send.personId = 999999
        })
        testStatusCode(derivativeOptions, 404)
      })
    })
  })

  describe('GET /search', () => {
    const personData = {
      name: 'Searchable Person',
      studentnumber: '011111111',
      role: 'STUDENT',
      university: 'helsinki.fi'
    }
    const query = {
      searchString: personData.name.split(' ')[0]
    }

    const options = {
      route: '/api/persons/search',
      method: 'get',
      preamble: {
        query,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    const ids = {}

    beforeAll((done) => {
      Person.create(personData).then((person) => {
        ids.person = person.id
        done()
      }).catch(done)
    })

    afterAll((done) => {
      Person.destroy({
        where: {
          id: ids.person
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testGlobalTeacherPrivilege(options)

    testBody(options, {
      common: [{
        ...personData,
        id: asymmetricMatcher(actual => actual === ids.person)
      }]
    })
  })
})
