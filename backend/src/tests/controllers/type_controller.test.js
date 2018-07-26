const { testTeacherOnCoursePrivilege, testHeaders } = require('../testUtils')

const data = {
  type_header_id: 1,
  eng_name: '8e',
  fin_name: '8f',
  swe_name: '8s',
  multiplier: 1
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

    testHeaders({
      route: '/api/types/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    })
  })
})
