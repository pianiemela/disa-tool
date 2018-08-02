const {
  testHeaders,
  testStatusCode,
  testTeacherOnCoursePrivilege,
  testBody,
  testDatabaseSave
} = require('../testUtils')
const { CourseInstance } = require('../../database/models.js')

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

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number),
          active: false
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
})
