const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy
} = require('../testUtils')
const { Category, Objective } = require('../../database/models.js')

describe('category_controller', () => {
  describe('POST /create', () => {
    const data = {
      course_instance_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn'
    }
    const options = {
      route: '/api/categories/create',
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
      Category,
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
    let newId

    beforeEach((done) => {
      Category.create({
        course_instance_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        newId = result.get({ plain: true }).id
        options.route = `/api/categories/${newId}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: expect.any(Number),
          tasks: []
        }
      }
    })

    describe('deletion cascades', () => {
      const cascadeIds = {}
      beforeEach((done) => {
        Objective.create({
          skill_level_id: 1,
          course_instance_id: 1,
          category_id: newId,
          eng_name: 'eno',
          fin_name: 'fno',
          swe_name: 'sno'
        }).then((result) => {
          cascadeIds.objective = result.get({ plain: true }).id
          done()
        })
      })
      testDatabaseDestroy(options, Category, {
        delay: 2000,
        cascade: [
          {
            model: Objective,
            getId: () => cascadeIds.objective
          }
        ]
      })
    })
  })
})
