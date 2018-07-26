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

    describe('json response', () => {
      let json
      beforeAll((done) => {
        server
          .post('/api/types/create')
          .send(data)
          .set('Authorization', `Bearer ${tokens.teacher}`)
          .then((response) => {
            json = response.body
            done()
          })
      })

      it('Contains a message', () => {
        expect(typeof json.message).toEqual('string')
      })

      it('Contains field "created" with appropriate object.', () => {
        expect(json.created).toMatchObject({
          id: expect.any(Number),
          name: data.fin_name,
          type_header_id: data.type_header_id,
          multiplier: data.multiplier
        })
      })
    })
  })
})
