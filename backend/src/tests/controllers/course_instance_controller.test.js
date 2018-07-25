const supertest = require('supertest')
const app = require('../../app.js')

describe('course_instance_controller', () => {
  let server
  beforeEach(() => {
    server = supertest(app)
  })

  it('responds 200 to GET /data/:id.', (done) => {
    server.get('/api/course-instances/data/1').then((response) => {
      expect(response.status).toEqual(200)
      done()
    })
  })
})
