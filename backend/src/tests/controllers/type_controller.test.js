const { TypeHeader } = require('../../database/models.js')
const { testTeacherOnCoursePrivilege } = require('../testUtils')

const data = {
  type_header_id: null,
  eng_name: '8e',
  fin_name: '8f',
  swe_name: '8s',
  multiplier: 1
}

describe('type_controller', () => {
  let server

  beforeAll(async () => {
    server = supertest(app)
    const header = await TypeHeader.findOne({
      where: {
        course_instance_id: 1
      }
    })
    data.type_header_id = header.toJSON().id
    await tokens.promise
  })

  describe('POST /create', () => {
    testTeacherOnCoursePrivilege({
      route: '/api/types/create',
      method: 'post',
      preamble: {
        send: data
      }
    })
  })
})
