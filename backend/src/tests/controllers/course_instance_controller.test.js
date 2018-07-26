describe('course_instance_controller', () => {
  it('responds 200 to GET /data/:id.', (done) => {
    server.get('/api/course-instances/data/1').then((response) => {
      expect(response.status).toEqual(200)
      done()
    })
  })
})
