const { testHeaders } = require('../testUtils')

describe('course_instance_controller', () => {
  const request = server.get('/api/course-instances/data/1')

  testHeaders(null, request)

  it('responds 200 to GET /data/:id.', (done) => {
    request.then((response) => {
      expect(response.status).toEqual(200)
      done()
    })
  })
})
