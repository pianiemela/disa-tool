const makeRequest = (options) => {
  let request = server[options.method](options.route)
  Object.keys(options.preamble).forEach((method) => {
    if (Array.isArray(options.preamble[method])) {
      request = request[method](...options.preamble[method])
    } else {
      request = request[method](options.preamble[method])
    }
  })
  return request
}

const testTeacherOnCoursePrivilege = (options) => {
  describe('teacher_on_course privilege', () => {
    it('is not granted when no authorization is provided', (done) => {
      makeRequest(options).set('Authorization', '').then((response) => {
        expect(response.status).toEqual(403)
        done()
      })
    })

    it('is not granted when invalid authorization is provided', async (done) => {
      makeRequest(options).set('Authorization', `Bearer ${tokens.student}`).then((response) => {
        expect(response.status).toEqual(403)
        done()
      })
    })

    it('is granted when valid authorization is provided', async (done) => {
      makeRequest(options).set('Authorization', `Bearer ${tokens.teacher}`).then((response) => {
        expect(response.status).toEqual(200)
        done()
      })
    })
  })
}

const testHeaders = (options) => {
  it('responds with appropriate headers.', (done) => {
    makeRequest(options).then((response) => {
      expect(response.headers['content-type'].includes('application/json')).toEqual(true)
      expect(response.headers['content-type'].includes('charset=utf-8')).toEqual(true)
      expect(response.headers.connection).toEqual('close')
      expect(response.headers).toHaveProperty('content-length')
      expect(response.headers['x-powered-by']).toEqual('Express')
      done()
    })
  })
}

const testBody = (options, match) => {
  it('returns an appropriate json object in response body.', (done) => {
    makeRequest(options).then((response) => {
      expect(response.body).toMatchObject(match)
      done()
    })
  })
}

module.exports = {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody
}
