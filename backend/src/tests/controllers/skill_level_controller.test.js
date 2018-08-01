const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher
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
})
