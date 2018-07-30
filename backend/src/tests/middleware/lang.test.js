const lang = require('../../middleware/lang.js')

describe('middleware lang', () => {
  let req
  let res
  let next

  beforeEach(() => {
    req = {
      query: {
        lang: 'eng'
      }
    }
    res = {}
    next = jest.fn()
  })

  it('writes req.lang.', () => {
    lang(req, res, next)
    expect(req.lang).toEqual('eng')
  })

  it('defaults to \'fin\' when no lang is provided.', () => {
    req.query = {}
    lang(req, res, next)
    expect(req.lang).toEqual('fin')
  })

  it('defaults to \'fin\' when a bad lang is provided.', () => {
    req.query.lang = 'doot'
    lang(req, res, next)
    expect(req.lang).toEqual('fin')
  })

  it('calls next.', () => {
    lang(req, res, next)
    expect(next).toHaveBeenCalled()
  })
})
