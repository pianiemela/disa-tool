const {
  testGlobalTeacherPrivilege,
  testHeaders,
  testBody,
  testDatabaseSave
} = require('../testUtils')
const { Course } = require('../../database/models.js')

describe('course_controller', () => {
  describe('POST /create', () => {
    const data = {
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn'
    }
    const options = {
      route: '/api/courses/create',
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

    testDatabaseSave(options, {
      ...data,
      id: expect.any(Number)
    }, Course)
  })
})
