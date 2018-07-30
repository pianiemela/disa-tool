const { testHeaders, testBody } = require('../testUtils.js')

describe('person_controller', () => {
  const options = {
    route: '/api/persons/user',
    method: 'get',
    preamble: {
      set: ['Authorization', `Bearer ${tokens.student}`]
    }
  }

  testHeaders(options)

  testBody(options, {
    common: {
      id: 421
    }
  })

  it('Responds with 204 when no authorization is provided.', (done) => {
    server
      .get(options.route)
      .then((response) => {
        expect(response.status).toEqual(204)
        done()
      })
  })
})
