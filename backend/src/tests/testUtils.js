/**
 * @return a supertest request (promise).
 *   server.method(route) + preamble methods chained.
 * @param {*} options object containing the following required fields:
 * {
 *   route: route to which request should be made.
 *   method: http method: 'get', 'post', 'put', 'delete'.
 *   preamble: object with no required fields.
 *     Keys are methods to be called on request and values are parameters to give those methods.
 *     Multiple parameters should be passed as an array.
 *
 *     example:
 *     {
 *       set: ['Authorization', 'Bearer <token>'],
 *       send: { id: 1 }
 *     }
 *     Will cause the following method calls to be run on request
 *     request = request
 *                 .set('Authorization', 'Bearer <token>')
 *                 .send({ id: 1 })
 * }
 */
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

/**
 * Helper function that merges two objects and all of their fields recursively.
 */
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

const testTeacherPrivilege = (options, description) => {
  describe(description, () => {
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

const testTeacherOnCoursePrivilege = options => testTeacherPrivilege(options, 'teacher_on_course privilege')

const testGlobalTeacherPrivilege = options => testTeacherPrivilege(options, 'global_teacher privilege')

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

/**
 * @param {*} match an object with the following fields. response.body should match this.
 *   {
 *     common: object containing fields that should be matched on all languages.
 *     eng: object containing fields that should be matched only when language is English.
 *     fin: same as eng, but for Finnish.
 *     swe: same as eng but for Swedish.
 *   }
 *   common can be left undefined if all languages are defined.
 *   Any language can be left undefined if common is defined.
 *   EXAMPLE
 *   {
 *     common: {
 *       message: 'test message',
 *       created: {
 *         id: 1
 *       }
 *     },
 *     eng: {
 *       created: {
 *         name: 'doot'
 *       }
 *     },
 *     fin: {
 *       created: {
 *         name: 'dööt'
 *       }
 *     },
 *     swe: {
 *       created: {
 *         name: 'dååt'
 *       }
 *     }
 *   }
 */
const testBody = (options, match) => {
  describe('returns an appropriate json object in response body', () => {
    it('in English.', (done) => {
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

    it('in Finnish.', (done) => {
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

    it('in Swedish.', (done) => {
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
  })
}

/**
 * @param {*} match Object that database row.toJSON() should match.
 * @param {*} model Database model.
 * @param {*} config Object with the following fields. Extra configuration goes here.
 * {
 *   pathToId: array of strings.
 *     If the id of the new database row is not found in response.body.created.id,
 *     define here where to find id in response.
 *   disallowId: boolean. If true, will add a field 'id' to request body and
 *     check that it had no effect on the response.
 * }
 */
const testDatabaseSave = (options, match, model, config = {}) => {
  const { disallowId = false, pathToId = ['body', 'created', 'id'] } = config
  const reqOptions = { ...options }
  if (disallowId) reqOptions.preamble.send = { ...reqOptions.preamble.send, id: 10001 }
  it('saves a row into the database.', (done) => {
    makeRequest(reqOptions).then((response) => {
      let id = response
      pathToId.forEach((step) => {
        id = id[step]
      })
      model.findById(id).then((row) => {
        const json = row.toJSON()
        if (disallowId) expect(json.id).not.toEqual(10001)
        expect(json).toMatchObject(match)
        done()
      })
    })
  })
}

/**
 * @param {*} model Database model.
 * @param {*} config Object with the following fields. Extra configuration goes here.
 * {
 *   pathToId: array of strings.
 *     If the id of the new database row is not found in response.body.deleted.id,
 *     define here where to find id in response.
 *   delay: number.
 *     Milliseconds to wait after receiving response.
 *   cascade: array of objects.
 *     Objects should have the following fields.
 *     {
 *       model: database model.
 *       getId: function that returns id to look for.
 *     }
 *     Each object will cause test to check that the table no longer has the specified row.
 * }
 */
const testDatabaseDestroy = (options, model, config = {}) => {
  const {
    pathToId = ['body', 'deleted', 'id'],
    delay = 0,
    cascade = []
  } = config

  const checkCascade = cascade.map(params => (response, cascadeStep) => {
    params.model.findById(params.getId()).then((result) => {
      expect(result).toEqual(null)
      checkCascade[cascadeStep](response, cascadeStep + 1)
    })
  })

  const checkDestruction = (response, cascadeStep) => {
    let id = response
    pathToId.forEach((step) => {
      id = id[step]
    })
    model.findById(id).then((result) => {
      expect(result).toEqual(null)
      checkCascade[cascadeStep](response, cascadeStep + 1)
    })
  }

  it('destroys a row from the database', (done) => {
    checkCascade.push(() => done())
    makeRequest(options).then((response) => {
      setTimeout(checkDestruction, delay, response, 0)
    })
  })
}

const asymmetricMatcher = matcher => ({
  $$typeof: Symbol.for('jest.asymmetricMatcher'),
  asymmetricMatch: matcher
})

const testStatusCode = (options, code) => {
  it('response status code is correct', (done) => {
    makeRequest(options).then((res) => {
      expect(res.status).toEqual(code)
      done()
    })
  })
}

module.exports = {
  testTeacherOnCoursePrivilege,
  testGlobalTeacherPrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
}
