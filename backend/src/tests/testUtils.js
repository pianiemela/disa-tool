const makeRequest = (server, options) => {
  let request = server[options.method](options.route)
  Object.keys(options.preamble).forEach((method) => {
    request = request[method](options.preamble[method])
  })
  return request
}

const testTeacherOnCoursePrivilege = (options) => {
  const server = supertest(app)
  describe('teacher_on_course privilege', () => {
    it('is not granted when no authorization is provided', (done) => {
      makeRequest(server, options).set('Authorization', '').then((response) => {
        expect(response.status).toEqual(403)
        done()
      })
    })

    it('is not granted when invalid authorization is provided', (done) => {
      makeRequest(server, options).set('Authorization', `Bearer ${tokens.student}`).then((response) => {
        expect(response.status).toEqual(403)
        done()
      })
    })

    it('is granted when valid authorization is provided', (done) => {
      makeRequest(server, options).set('Authorization', `Bearer ${tokens.teacher}`).then((response) => {
        expect(response.status).toEqual(200)
        done()
      })
    })
  })
}

module.exports = {
  testTeacherOnCoursePrivilege
}
