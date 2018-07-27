const { testTeacherOnCoursePrivilege, testHeaders, testBody, testDatabaseSave, testDatabaseDestroy } = require('../testUtils')
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

    beforeEach((done) => {
      Type.create({
        type_header_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        options.route = `/api/types/${result.get({ plain: true }).id}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: expect.any(Number),
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
    let newId

    beforeEach((done) => {
      TypeHeader.create({
        course_instance_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        newId = result.get({ plain: true }).id
        options.route = `/api/types/headers/${newId}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: expect.any(Number)
        }
      }
    })

    describe('deletion cascades and', () => {
      const cascadeIds = {}
      beforeEach((done) => {
        Type.create({
          type_header_id: newId,
          eng_name: 'ent',
          fin_name: 'fnt',
          swe_name: 'snt'
        }).then((result) => {
          cascadeIds.type = result.get({ plain: true }).id
          done()
        })
      })

      testDatabaseDestroy(options, TypeHeader, {
        delay: 2000,
        cascade: [
          {
            model: Type,
            getId: () => cascadeIds.type
          }
        ]
      })
    })
  })
})
