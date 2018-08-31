const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { Grade } = require('../../database/models.js')

describe('grade controller', () => {
  beforeAll((done) => {
    Grade.create({
      eng_name: 'e',
      fin_name: 'f',
      swe_name: 's',
      skill_level_id: 1,
      needed_for_grade: 0.2,
      prerequisite: null
    }).then(() => done()).catch(done)
  })

  describe('GET /course/:id', () => {
    const options = {
      route: '/api/grades/course/1',
      method: 'get',
      preamble: {}
    }

    testHeaders(options)

    testStatusCode(options, 200)
  })

  describe('POST /create', () => {
    const data = {
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn',
      skill_level_id: 1,
      needed_for_grade: 0.5,
      prerequisite: 1
    }
    const options = {
      route: '/api/grades/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/grades/course/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          skill_level_id: data.skill_level_id,
          needed_for_grade: data.needed_for_grade,
          prerequisite: data.prerequisite
        }
      },
      eng: {
        created: {
          name: data.eng_name
        }
      },
      fin: {
        created: {
          name: data.fin_name
        }
      },
      swe: {
        created: {
          name: data.swe_name
        }
      }
    })

    testDatabaseSave(options, {
      ...data,
      id: expect.any(Number)
    }, Grade, { disallowId: true })
  })

  describe('DELETE /:id', () => {
    const options = {
      method: 'delete',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const ids = {}

    beforeEach((done) => {
      Grade.create({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        skill_level_id: 1,
        needed_for_grade: 0.1,
        prerequisite: null
      }).then((result) => {
        ids.grade = result.get({ plain: true }).id
        options.route = `/api/grades/${ids.grade}`
        Grade.findById(1).then((instance) => {
          // This is done to assert that a grade pointing
          // to the deleted grade as its prerequisite will not be destroyed.
          instance.update({
            prerequisite: ids.grade
          }).then(() => done()).catch(done)
        }).catch(done)
      }).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/grades/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.grade)
        }
      }
    })

    testDatabaseDestroy(options, Grade, { delay: 2000 })
  })

  describe('GET /:id', () => {
    const options = {
      route: '/api/grades/1',
      method: 'get',
      preamble: {}
    }

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/grades/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          id: 1,
          eng_name: 'e',
          fin_name: 'f',
          swe_name: 's',
          skill_level_id: 1,
          needed_for_grade: 0.2,
          prerequisite: null
        }
      }
    })
  })

  describe('PUT /:id', () => {
    const data = {
      eng_name: 'new en',
      fin_name: 'new fn',
      swe_name: 'new sn',
      skill_level_id: 2,
      needed_for_grade: 0.8,
      prerequisite: 1
    }
    const options = {
      route: '/api/grades',
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const ids = {}
    const databaseExpectation = {}

    beforeAll((done) => {
      Grade.create({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        skill_level_id: 1,
        needed_for_grade: 0.2,
        prerequisite: null
      }).then((result) => {
        ids.grade = result.id
        options.route = `${options.route}/${ids.grade}`
        databaseExpectation.created_at = result.created_at
        done()
      })
    })

    afterEach((done) => {
      Grade.findById(ids.grade).then(instance => instance.update({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        skill_level_id: 1,
        needed_for_grade: 0.2,
        prerequisite: null
      }).then(() => done()))
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/grades/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.grade),
          skill_level_id: data.skill_level_id,
          needed_for_grade: data.needed_for_grade,
          prerequisite: data.prerequisite
        }
      },
      eng: {
        edited: {
          name: data.eng_name
        }
      },
      fin: {
        edited: {
          name: data.fin_name
        }
      },
      swe: {
        edited: {
          name: data.swe_name
        }
      }
    })

    testDatabaseSave(options, {
      ...data,
      id: asymmetricMatcher(actual => actual === ids.grade),
      created_at: asymmetricMatcher(
        actual => !(actual < databaseExpectation.created_at || actual > databaseExpectation.created_at)
      ),
      updated_at: asymmetricMatcher(actual => actual > databaseExpectation.created_at)
    }, Grade, {
      pathToId: ['body', 'edited', 'id'],
      includeTimestamps: false
    })
  })
})
