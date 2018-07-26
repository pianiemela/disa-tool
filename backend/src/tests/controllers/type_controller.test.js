const { testTeacherOnCoursePrivilege, testHeaders, testBody } = require('../testUtils')

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

describe('type_controller', () => {
  describe('POST /create', () => {
    testTeacherOnCoursePrivilege({
      route: '/api/types/create',
      method: 'post',
      preamble: {
        send: data
      }
    })

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
  })
})
