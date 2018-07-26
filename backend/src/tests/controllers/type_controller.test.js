const { testTeacherOnCoursePrivilege, testHeaders, testBody, testDatabaseSave } = require('../testUtils')
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
      message: expect.any(String),
      created: {
        id: expect.any(Number),
        name: data.fin_name,
        type_header_id: data.type_header_id,
        multiplier: data.multiplier
      }
    })

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        ...data
      },
      Type
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
      message: expect.any(String),
      created: {
        id: expect.any(Number),
        name: data.fin_name
      }
    })

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        ...data
      },
      TypeHeader
    )
  })
})
