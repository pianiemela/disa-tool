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
  const doNotSpread = options.do_not_spread || []
  let request = server[options.method](options.route)
  Object.keys(options.preamble).forEach((method) => {
    if (Array.isArray(options.preamble[method]) && !doNotSpread.includes(method)) {
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
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.map((value, index) => mergeRecursive(value, b[index]))
  }
  if (a.mergeType === 'unorderedList' && b.mergeType === 'unorderedList') {
    const result = unorderedListMatcher(
      a.list.map((value, index) => mergeRecursive(value, b.list[index]))
    )
    return result
  }
  const merged = { ...a }
  Object.entries(b).forEach(([key, value]) => {
    if (merged[key] !== undefined) {
      merged[key] = mergeRecursive(merged[key], value)
    } else {
      merged[key] = value
    }
  })
  return merged
}

const testTeacherPrivilege = (options, description, codes = {}, level) => {
  const {
    success = 200,
    failure = 403
  } = codes
  const levels = [
    'student',
    'teacher',
    'admin'
  ]
  describe(description, () => {
    if (levels[level] !== 'student') {
      it('is not granted when invalid authorization is provided', (done) => {
        makeRequest(options).set('uid', tokens[levels[level - 1]]).then((response) => {
          try {
            expect(response.status).toEqual(failure)
            done()
          } catch (e) {
            done(e)
          }
        }).catch(done)
      })
    }
    it('is granted when valid authorization is provided', (done) => {
      makeRequest(options).set('uid', tokens[levels[level]]).then((response) => {
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
  codes,
  1
)

const testGlobalTeacherPrivilege = (options, codes) => testTeacherPrivilege(
  options,
  'global_teacher privilege',
  codes,
  1
)

const testAdminPrivilege = (options, codes) => testTeacherPrivilege(
  options,
  'admin privilege',
  codes,
  2
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
    it(text.eng, checkBodyInLanguage('eng')(options, match, config))
    it(text.fin, checkBodyInLanguage('fin')(options, match, config))
    it(text.swe, checkBodyInLanguage('swe')(options, match, config))
  })
}

const checkBodyInLanguage = lang => (options, match, config) => (done) => {
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
      if (Array.isArray(response.body) && !config.do_not_spread) {
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
        const matcher = config.matcher || 'toMatchObject'
        expect(response.body)[matcher](expected)
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
 *     Passed as an argument to model.findByPk (number) or model.findOne (object) to find the saved row.
 * }
 */
const testDatabaseSave = (options, match, model, config = {}) => {
  const {
    disallowId = false,
    pathToId = ['body', 'created', 'id'],
    includeTimestamps = true,
    findBy = null,
    text = 'saves a row into the database.',
    delay = 100
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
          findFunction = (typeof search === 'number' ? 'findByPk' : 'findOne')
        } else {
          findFunction = 'findByPk'
          search = response
          pathToId.forEach((step) => {
            search = search[step]
          })
          expect(typeof search).toEqual('number')
        }
        setTimeout(() => {
          model[findFunction](search).then((row) => {
            let json
            try {
              expect(row).toBeTruthy()
              json = row.toJSON()
              if (disallowId) expect(json.id).not.toEqual(10001)
              try {
                expect(json).toMatchObject(match)
              } catch (e) {
                done({
                  expected: match,
                  received: json
                })
                return
              }
              if (includeTimestamps) expect(json).toMatchObject(timestamps)
              done()
            } catch (e) {
              done(e)
            }
          }).catch(done)
        }, delay)
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
 *     Passed as an argument to model.findByPk (number) or model.findOne (object) to find (lack of) the saved row.
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
    params.model.findByPk(params.getId()).then((result) => {
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
      findFunction = (typeof search === 'number' ? 'findByPk' : 'findOne')
    } else {
      findFunction = 'findByPk'
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

const unorderedListMatcher = list => ({
  $$typeof: Symbol.for('jest.asymmetricMatcher'),
  mergeType: 'unorderedList',
  list,
  asymmetricMatch: (actual) => {
    if (!Array.isArray(actual)) return false
    let result = true
    list.forEach((listElement) => {
      let matched = false
      actual.forEach((actualElement) => {
        try {
          if (typeof listElement === 'object') {
            expect(actualElement).toMatchObject(listElement)
          } else {
            expect(actualElement).toEqual(listElement)
          }
          matched = true
          // eslint-disable-next-line no-empty
        } catch (e) { }
      })
      result = result && matched
    })
    return result
  }
})

module.exports = {
  makeRequest,
  testTeacherOnCoursePrivilege,
  testGlobalTeacherPrivilege,
  testAdminPrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode,
  unorderedListMatcher
}
