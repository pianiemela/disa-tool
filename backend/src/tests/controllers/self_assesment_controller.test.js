const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { SelfAssessment } = require('../../database/models.js')


describe('self_assesment_controller', () => {
  describe('DELETE /:id', () => {
    const options = {
      method: 'delete',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const ids = {}

    beforeEach((done) => {
      SelfAssessment.create({
        course_instance_id: 1,
        eng_name: 'e',
        fin_name: 'f',
        swe_name: 's',
        eng_instructions: 'ei',
        fin_instructions: 'fi',
        swe_instructions: 'si',
        open: false,
        active: false,
        show_feedback: false,
        structure: JSON.stringify({})
      }).then((result) => {
        ids.self_assesment = result.get({ plain: true }).id
        options.route = `/api/selfassesment/${ids.self_assesment}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testStatusCode({ ...options, route: '/api/selfassesment/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.self_assesment)
        }
      }
    })

    testDatabaseDestroy(options, SelfAssessment, { delay: 2000 })
  })
})
