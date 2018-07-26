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

const mergeRecursive = (a, b) => {
  if (!a) {
    return b
  }
  if (!b) {
    return a
  }
  const merged = { ...a }
  Object.keys(b).forEach((key) => {
    if (merged[key] !== undefined) {
      merged[key] = mergeRecursive(merged[key], b[key])
    } else {
      merged[key] = b[key]
    }
  })
  return merged
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
  it('returns an appropriate json object in response body in English.', (done) => {
    makeRequest({
      ...options,
      preamble: {
        ...options.preamble,
        query: { lang: 'eng' }
      }
    }).then((response) => {
      expect(response.body).toMatchObject(mergeRecursive(match.common, match.eng))
      done()
    })
  })

  it('returns an appropriate json object in response body in Finnish.', (done) => {
    makeRequest({
      ...options,
      preamble: {
        ...options.preamble,
        query: { lang: 'fin' }
      }
    }).then((response) => {
      expect(response.body).toMatchObject(mergeRecursive(match.common, match.fin))
      done()
    })
  })

  it('returns an appropriate json object in response body in Swedish.', (done) => {
    makeRequest({
      ...options,
      preamble: {
        ...options.preamble,
        query: { lang: 'swe' }
      }
    }).then((response) => {
      expect(response.body).toMatchObject(mergeRecursive(match.common, match.swe))
      done()
    })
  })
}

const testDatabaseSave = (options, match, model, pathToId = ['body', 'created', 'id']) => {
  it('saves a row into the database.', (done) => {
    makeRequest(options).then((response) => {
      let id = response
      pathToId.forEach((step) => {
        id = id[step]
      })
      model.findById(id).then((row) => {
        expect(row.toJSON()).toMatchObject(match)
        done()
      })
    })
  })
}

module.exports = {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave
}
