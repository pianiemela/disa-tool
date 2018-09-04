const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { SkillLevel, Objective } = require('../../database/models.js')

describe('skill_level_controller', () => {
  describe('POST /create', () => {
    const data = {
      course_instance_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn'
    }
    const options = {
      route: '/api/skill-levels/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number)
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

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        ...data
      },
      SkillLevel,
      {
        disallowId: true
      }
    )
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
      SkillLevel.create({
        course_instance_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        ids.skill_level = result.get({ plain: true }).id
        options.route = `/api/skill-levels/${ids.skill_level}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testStatusCode({ ...options, route: '/api/skill-levels/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.skill_level),
          tasks: []
        }
      }
    })

    describe('deletion cascades', () => {
      beforeEach((done) => {
        Objective.create({
          skill_level_id: ids.skill_level,
          course_instance_id: 1,
          category_id: 1,
          eng_name: 'eno',
          fin_name: 'fno',
          swe_name: 'sno'
        }).then((result) => {
          ids.objective = result.get({ plain: true }).id
          done()
        })
      })
      testDatabaseDestroy(options, SkillLevel, {
        delay: 2000,
        cascade: [
          {
            model: Objective,
            getId: () => ids.objective
          }
        ]
      })
    })
  })

  describe('GET /:id', () => {
    const data = {
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn',
      course_instance_id: 1
    }
    const options = {
      route: '/api/skill-levels',
      method: 'get',
      preamble: {}
    }
    const ids = {}

    beforeAll((done) => {
      SkillLevel.create(data).then((result) => {
        ids.level = result.get({ plain: true }).id
        options.route = `${options.route}/${ids.level}`
        done()
      }).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/skill-levels/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          ...data,
          id: asymmetricMatcher(actual => actual === ids.level)
        }
      }
    })
  })

  describe('PUT /:id', () => {
    const data = {
      eng_name: 'new en',
      fin_name: 'new fn',
      swe_name: 'new sn'
    }
    const options = {
      route: '/api/skill-levels',
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const ids = {}
    const databaseExpectation = {}

    beforeAll((done) => {
      SkillLevel.create({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        course_instance_id: 1
      }).then((result) => {
        ids.level = result.get({ plain: true }).id
        options.route = `${options.route}/${ids.level}`
        databaseExpectation.created_at = result.get({ plain: true }).created_at
        done()
      }).catch(done)
    })

    afterEach((done) => {
      SkillLevel.findById(ids.level).then(
        instance => instance.update({
          eng_name: 'en',
          fin_name: 'fn',
          swe_name: 'sn'
        }).then(() => done()).catch(done)
      ).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/skill-levels/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.level)
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

    testDatabaseSave(
      options,
      {
        ...data,
        id: asymmetricMatcher(actual => actual === ids.level),
        course_instance_id: 1,
        created_at: asymmetricMatcher(actual => !(
          actual < databaseExpectation.created_at || actual > databaseExpectation.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.created_at)
      },
      SkillLevel,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })
})
