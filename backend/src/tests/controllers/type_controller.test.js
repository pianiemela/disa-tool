const { TypeHeader } = require('../../database/models.js')

const data = {
  type_header_id: null,
  eng_name: '8e',
  fin_name: '8f',
  swe_name: '8s',
  multiplier: 1
}

describe('type_controller', () => {
  let server

  beforeAll(async () => {
    server = supertest(app)
    const header = await TypeHeader.findOne({
      where: {
        course_instance_id: 1
      }
    })
    data.type_header_id = header.toJSON().id
    await tokens.promise
  })

  describe('POST /create', () => {
    it('responds 403 when no authorization is provided.', (done) => {
      server.post('/api/types/create').send(data).then((response) => {
        expect(response.status).toEqual(403)
        done()
      })
    })

    it('responds 403 when invalid authorization is provided.', (done) => {
      server.post('/api/types/create')
        .send(data)
        .set('Authorization', `Bearer ${tokens.student}`)
        .then((response) => {
          expect(response.status).toEqual(403)
          done()
        })
    })

    it('responds 200 when valid authorization is provided.', (done) => {
      server.post('/api/types/create')
        .send(data)
        .set('Authorization', `Bearer ${tokens.teacher}`)
        .then((response) => {
          expect(response.status).toEqual(200)
          done()
        })
    })
  })
})
