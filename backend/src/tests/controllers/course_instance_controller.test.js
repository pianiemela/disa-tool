const { testHeaders } = require('../testUtils')

describe.skip('course_instance_controller', () => {
  testHeaders({
    route: '/api/course-instances/data/1',
    method: 'get',
    preamble: {}
  })

  it('responds 200 to GET /data/:id.', (done) => {
    server.get('/api/course-instances/data/1').then((response) => {
      expect(response.status).toEqual(200)
      done()
    })
  })
})
