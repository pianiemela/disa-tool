const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { Type, TypeHeader } = require('../../database/models.js')

describe('type_controller', () => {
  describe('POST /create', () => {
    const data = {
      type_header_id: 1,
      eng_name: '8e',
      fin_name: '8f',
      swe_name: '8s',
      multiplier: 1
    }
    const options = {
      route: '/api/types/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number),
          type_header_id: data.type_header_id,
          multiplier: data.multiplier
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
        id: expect.any(Number),
        ...data
      },
      Type,
      {
        disallowId: true
      }
    )
  })

  describe('POST /headers/create', () => {
    const data = {
      course_instance_id: 1,
      eng_name: 'e',
      fin_name: 'f',
      swe_name: 's'
    }
    const options = {
      route: '/api/types/headers/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number)
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
        id: expect.any(Number),
        ...data
      },
      TypeHeader,
      {
        disallowId: true
      }
    )
  })

  describe('DELETE /:id', () => {
    const options = {
      method: 'delete',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const ids = {}

    beforeEach((done) => {
      Type.create({
        type_header_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        ids.type = result.get({ plain: true }).id
        options.route = `/api/types/${ids.type}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.type),
          type_header_id: 1,
          task_ids: []
        }
      }
    })

    testDatabaseDestroy(options, Type, { delay: 2000 })
  })

  describe('DELETE /headers/:id', () => {
    const options = {
      method: 'delete',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const ids = {}

    beforeEach((done) => {
      TypeHeader.create({
        course_instance_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        ids.type_header = result.get({ plain: true }).id
        options.route = `/api/types/headers/${ids.type_header}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.type_header)
        }
      }
    })

    describe('deletion cascades and', () => {
      beforeEach((done) => {
        Type.create({
          type_header_id: ids.type_header,
          eng_name: 'ent',
          fin_name: 'fnt',
          swe_name: 'snt'
        }).then((result) => {
          ids.type = result.get({ plain: true }).id
          done()
        })
      })

      testDatabaseDestroy(options, TypeHeader, {
        delay: 2000,
        cascade: [
          {
            model: Type,
            getId: () => ids.type
          }
        ]
      })
    })
  })

  describe('GET /:id', () => {
    const options = {
      route: '/api/types/1',
      method: 'get',
      preamble: {}
    }
    const expectedBody = {
      common: {
        message: expect.any(String),
        data: {
          id: 1
        }
      }
    }

    beforeAll((done) => {
      Type.findById(1).then((result) => {
        expectedBody.common.data.eng_name = result.eng_name
        expectedBody.common.data.fin_name = result.fin_name
        expectedBody.common.data.swe_name = result.swe_name
        expectedBody.common.data.multiplier = result.multiplier
        done()
      })
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/types/999999' }, 404)

    testBody(options, expectedBody)
  })

  describe('PUT /:id', () => {
    const data = {
      eng_name: 'new en',
      fin_name: 'new fn',
      swe_name: 'new sn',
      multiplier: 0.7
    }
    const options = {
      route: '/api/types',
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const ids = {}
    const databaseExpectation = {}

    beforeAll((done) => {
      Type.create({
        type_header_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        multiplier: 1
      }).then((result) => {
        ids.type = result.id
        options.route = `${options.route}/${ids.type}`
        databaseExpectation.created_at = result.created_at
        done()
      })
    })

    beforeEach((done) => {
      Type.findById(ids.type).then(instance => instance.update({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        multiplier: 1
      }).then(() => done()))
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/types/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.type),
          multiplier: data.multiplier,
          type_header_id: 1
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
        id: asymmetricMatcher(actual => actual === ids.type),
        type_header_id: 1,
        created_at: asymmetricMatcher(actual => !(
          actual < databaseExpectation.created_at || actual > databaseExpectation.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.created_at)
      },
      Type,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })
})
