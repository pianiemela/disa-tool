/**
 * @return a supertest request (promise).
 *   server.method(route) + preamble methods chained.
 * @param {Object} options object containing the following required fields:
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

const testTeacherPrivilege = (options, description, codes = {}) => {
  const {
    success = 200,
    failure = 403
  } = codes
  describe(description, () => {
    it('is not granted when no authorization is provided', (done) => {
      makeRequest(options).set('Authorization', '').then((response) => {
        try {
          expect(response.status).toEqual(failure)
          done()
        } catch (e) {
          done(e)
        }
      }).catch(done)
    })

    it('is not granted when invalid authorization is provided', (done) => {
      makeRequest(options).set('Authorization', `Bearer ${tokens.student}`).then((response) => {
        try {
          expect(response.status).toEqual(failure)
          done()
        } catch (e) {
          done(e)
        }
      }).catch(done)
    })

    it('is granted when valid authorization is provided', (done) => {
      makeRequest(options).set('Authorization', `Bearer ${tokens.teacher}`).then((response) => {
        try {
          expect(response.status).toEqual(success)
          done()
        } catch (e) {
          done(e)
        }
      }).catch(done)
    })
  })
}

const testTeacherOnCoursePrivilege = (options, codes) => testTeacherPrivilege(
  options,
  'teacher_on_course privilege',
  codes
)

const testGlobalTeacherPrivilege = (options, codes) => testTeacherPrivilege(
  options,
  'global_teacher privilege',
  codes
)

const testHeaders = (options) => {
  it('responds with appropriate headers.', (done) => {
    makeRequest(options).then((response) => {
      try {
        expect(response.headers['content-type'].includes('application/json')).toEqual(true)
        expect(response.headers['content-type'].includes('charset=utf-8')).toEqual(true)
        expect(response.headers.connection).toEqual('close')
        expect(response.headers).toHaveProperty('content-length')
        expect(response.headers['x-powered-by']).toEqual('Express')
        done()
      } catch (e) {
        done(e)
      }
    }).catch(done)
  })
}

/**
 * @param {Object} match an object with the following fields. response.body should match this.
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
const testBody = (options, match, config = {}) => {
  const text = {
    describe: 'returns an appropriate json object in response body',
    eng: 'in English.',
    fin: 'in Finnish.',
    swe: 'in Swedish.',
    ...config.text
  }
  describe(text.describe, () => {
    it(text.eng, checkBodyInLanguage('eng')(options, match))
    it(text.fin, checkBodyInLanguage('fin')(options, match))
    it(text.swe, checkBodyInLanguage('swe')(options, match))
  })
}

const checkBodyInLanguage = lang => (options, match) => (done) => {
  makeRequest({
    ...options,
    preamble: {
      ...options.preamble,
      query: { lang }
    }
  }).then((response) => {
    let expected
    try {
      try {
        expected = mergeRecursive(match.common, match[lang])
      } catch (e) {
        done(e)
      }
      if (Array.isArray(response.body)) {
        let index = 0
        try {
          while (index < response.body.length) {
            expect(response.body[index]).toMatchObject(expected[index])
            index += 1
          }
        } catch (e) {
          done({
            expected: expected[index],
            received: response.body[index]
          })
        }
      } else {
        expect(response.body).toMatchObject(expected)
      }
      done()
    } catch (e) {
      done({
        expected,
        received: response.body
      })
    }
  }).catch(done)
}

const timestamps = {
  updated_at: expect.any(Date),
  created_at: expect.any(Date)
}

/**
 * @param {Object} match Object that database row.toJSON() should match.
 * @param {Object} model Database model.
 * @param {Object} config Object with the following fields. Extra configuration goes here.
 * {
 *   pathToId: array of strings.
 *     If the id of the new database row is not found in response.body.created.id,
 *     define here where to find id in response.
 *   disallowId: boolean. If true, will add a field 'id' to request body and
 *     check that it had no effect on the response.
 *   findBy: number, object or function that returns a number or an object.
 *     Passed as an argument to model.findById (number) or model.findOne (object) to find the saved row.
 * }
 */
const testDatabaseSave = (options, match, model, config = {}) => {
  const {
    disallowId = false,
    pathToId = ['body', 'created', 'id'],
    includeTimestamps = true,
    findBy = null,
    text = 'saves a row into the database.'
  } = config
  it(text, (done) => {
    const reqOptions = { ...options }
    if (disallowId) reqOptions.preamble.send = { ...reqOptions.preamble.send, id: 10001 }

    makeRequest(reqOptions).then((response) => {
      try {
        let search
        let findFunction
        if (findBy) {
          search = findBy
          if (typeof findBy === 'function') {
            search = findBy()
          }
          findFunction = (typeof search === 'number' ? 'findById' : 'findOne')
        } else {
          findFunction = 'findById'
          search = response
          pathToId.forEach((step) => {
            search = search[step]
          })
          expect(typeof search).toEqual('number')
        }
        model[findFunction](search).then((row) => {
          let json
          try {
            expect(row).toBeTruthy()
            json = row.toJSON()
            if (disallowId) expect(json.id).not.toEqual(10001)
            expect(json).toMatchObject(match)
            if (includeTimestamps) expect(json).toMatchObject(timestamps)
            done()
          } catch (e) {
            done(e)
          }
        }).catch(done)
      } catch (e) {
        done(e)
      }
    }).catch(done)
  })
}

/**
 * @param {Object} model Database model.
 * @param {Object} config Object with the following fields. Extra configuration goes here.
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
 *   findBy: number, object or function that returns a number or an object.
 *     Passed as an argument to model.findById (number) or model.findOne (object) to find (lack of) the saved row.
 * }
 */
const testDatabaseDestroy = (options, model, config = {}) => {
  const {
    pathToId = ['body', 'deleted', 'id'],
    delay = 0,
    cascade = [],
    findBy
  } = config

  const checkCascade = cascade.map(params => (response, cascadeStep, done) => {
    params.model.findById(params.getId()).then((result) => {
      try {
        expect(result).toEqual(null)
        checkCascade[cascadeStep](response, cascadeStep + 1)
      } catch (e) {
        done(e)
      }
    }).catch(done)
  })

  const checkDestruction = (response, cascadeStep, done) => {
    let search
    let findFunction
    if (findBy) {
      search = findBy
      if (typeof findBy === 'function') {
        search = findBy()
      }
      findFunction = (typeof search === 'number' ? 'findById' : 'findOne')
    } else {
      findFunction = 'findById'
      search = response
      pathToId.forEach((step) => {
        search = search[step]
      })
      expect(typeof search).toEqual('number')
    }
    model[findFunction](search).then((result) => {
      try {
        expect(result).toEqual(null)
        checkCascade[cascadeStep](response, cascadeStep + 1, done)
      } catch (e) {
        done(e)
      }
    }).catch(done)
  }

  it('destroys a row from the database', (done) => {
    checkCascade.push(() => done())
    makeRequest(options).then((response) => {
      setTimeout(checkDestruction, delay, response, 0, done)
    }).catch(done)
  })
}

const asymmetricMatcher = matcher => ({
  $$typeof: Symbol.for('jest.asymmetricMatcher'),
  asymmetricMatch: matcher
})

const testStatusCode = (options, code) => {
  it('response status code is correct', (done) => {
    makeRequest(options).then((res) => {
      try {
        expect(res.status).toEqual(code)
        done()
      } catch (e) {
        done(e)
      }
    }).catch(done)
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
