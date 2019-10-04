const { checkAuth } = require('../../services/auth.js')

describe('auth service', () => {
  describe('checkAuth function', () => {
    it('returns correct user when token is provided.', () => {
      const req = {
        headers: {
          uid: 'jemisa'
        }
      }
      expect(checkAuth(req)).toMatchObject({
        id: 370
      })
      req.headers.uid = 'mikkoti'
      expect(checkAuth(req)).toMatchObject({
        id: 360
      })
    })

    it('returns null when no authorization is provided.', () => {
      const req = {
        headers: {}
      }
      expect(checkAuth(req)).toEqual(null)
    })

    it('returns null when malformed authorization is provided.', () => {
      const req = {
        headers: {
          uid: 'jemisa'
        }
      }
      expect(checkAuth(req)).toEqual(null)
    })
  })
})
