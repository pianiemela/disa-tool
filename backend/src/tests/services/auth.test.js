const { checkAuth } = require('../../services/auth.js')

describe('auth service', () => {
  describe('checkAuth function', () => {
    it('returns correct user when token is provided.', async () => {
      const req = {
        headers: {
          uid: 'jemisa'
        }
      }
      expect(await checkAuth(req)).toMatchObject({
        id: 370
      })
      req.headers.uid = 'mikkoti'
      expect(await checkAuth(req)).toMatchObject({
        id: 410
      })
    })

    it('returns null when no authorization is provided.', async () => {
      const req = {
        headers: {}
      }
      expect(await checkAuth(req)).toEqual(null)
    })
  })
})
