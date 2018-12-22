const {
  testHeaders,
  testStatusCode,
  testTeacherOnCoursePrivilege,
  testGlobalTeacherPrivilege,
  testBody,
  testDatabaseSave,
  asymmetricMatcher
} = require('../testUtils')
const { CourseInstance, CoursePerson } = require('../../database/models.js')

describe('course_instance_controller', () => {
  describe('GET /data/:courseInstanceId', () => {
    const options = {
      route: '/api/course-instances/data/1',
      method: 'get',
      preamble: {}
    }

    testHeaders(options)

    testStatusCode(options, 200)
  })

  describe('POST /create', () => {
    const data = {
      course_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn'
    }
    const options = {
      route: '/api/course-instances/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    testHeaders(options)

    testGlobalTeacherPrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number),
          active: false,
          registered: 'TEACHER'
        }
      },
      eng: {
        created: {
          name: data.eng_name
        }
      },
      fin: {
        created: {
          name: data.fin_name
        }
      },
      swe: {
        created: {
          name: data.swe_name
        }
      }
    })

    testDatabaseSave(
      options,
      {
        ...data,
        active: false,
        id: expect.any(Number)
      },
      CourseInstance,
      {
        disallowId: true
      }
    )
  })

  describe('POST /copy', () => {
    const data = {
      course_id: 1,
      course_instance_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn'
    }
    const options = {
      route: '/api/course-instances/copy',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    testHeaders(options)

    testGlobalTeacherPrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number),
          active: false,
          registered: 'TEACHER'
        }
      },
      eng: {
        created: {
          name: data.eng_name
        }
      },
      fin: {
        created: {
          name: data.fin_name
        }
      },
      swe: {
        created: {
          name: data.swe_name
        }
      }
    })

    // The copy should be validated to be equal to the copied course instance.
    // That's a gargantuan task, though, and not worth developer time.
  })

  describe('GET /edit/:id', () => {
    const options = {
      route: '/api/course-instances/edit',
      method: 'get',
      preamble: {}
    }
    const ids = {}

    beforeAll((done) => {
      CourseInstance.create({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        ids.courseInstance = result.get({ plain: true }).id
        options.route = `${options.route}/${ids.courseInstance}`
        done()
      }).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/course-instances/edit/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          id: asymmetricMatcher(actual => actual === ids.courseInstance),
          eng_name: 'en',
          fin_name: 'fn',
          swe_name: 'sn'
        }
      }
    })
  })

  describe('PUT /edit/:id', () => {
    const data = {
      eng_name: 'new en',
      fin_name: 'new fn',
      swe_name: 'new sn'
    }
    const options = {
      route: '/api/course-instances/edit',
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const ids = {}
    const databaseExpectation = {}

    beforeAll((done) => {
      CourseInstance.create({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        ids.courseInstance = result.id
        databaseExpectation.created_at = result.created_at
        databaseExpectation.updated_at = result.updated_at
        options.route = `${options.route}/${ids.courseInstance}`
        CoursePerson.create({
          person_id: 424,
          course_instance_id: ids.courseInstance,
          role: 'TEACHER'
        }).then(() => done()).catch(done)
      }).catch(done)
    })

    afterEach((done) => {
      CourseInstance.findById(ids.courseInstance).then((ci) => {
        ci.update({
          eng_name: 'en',
          fin_name: 'fn',
          swe_name: 'sn'
        }).then((result) => {
          databaseExpectation.updated_at = result.updated_at
          done()
        }).catch(done)
      }).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/course-instances/edit/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.courseInstance)
        }
      },
      eng: {
        edited: {
          name: data.eng_name
        }
      },
      fin: {
        edited: {
          name: data.fin_name
        }
      },
      swe: {
        edited: {
          name: data.swe_name
        }
      }
    })

    testDatabaseSave(
      options,
      {
        ...data,
        id: asymmetricMatcher(actual => actual === ids.courseInstance),
        created_at: asymmetricMatcher(actual => !(
          actual > databaseExpectation.created_at
          || actual < databaseExpectation.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.updated_at)
      },
      CourseInstance,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })
})
