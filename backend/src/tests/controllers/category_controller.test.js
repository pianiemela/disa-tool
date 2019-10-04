const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { Category, Objective } = require('../../database/models.js')

describe('category_controller', () => {
  describe('POST /create', () => {
    const data = {
      course_instance_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn',
      order: 1
    }
    const options = {
      route: '/api/categories/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['uid', 'mikkoti']
      }
    }

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number),
          order: data.order
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
        set: ['uid', 'mikkoti']
      }
    }
    const ids = {}

    beforeEach((done) => {
      Category.create({
        course_instance_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        order: 1
      }).then((result) => {
        ids.category = result.get({ plain: true }).id
        options.route = `/api/categories/${ids.category}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testStatusCode({ ...options, route: '/api/categories/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.category),
          tasks: []
        }
      }
    })

    describe('deletion cascades', () => {
      beforeEach((done) => {
        Objective.create({
          skill_level_id: 1,
          course_instance_id: 1,
          category_id: ids.category,
          eng_name: 'eno',
          fin_name: 'fno',
          swe_name: 'sno',
          order: 1
        }).then((result) => {
          ids.objective = result.get({ plain: true }).id
          done()
        })
      })
      testDatabaseDestroy(options, Category, {
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
      course_instance_id: 1,
      order: 10
    }
    const options = {
      route: '/api/categories',
      method: 'get',
      preamble: {}
    }
    const ids = {}

    beforeAll((done) => {
      Category.create(data).then((result) => {
        ids.category = result.get({ plain: true }).id
        options.route = `${options.route}/${ids.category}`
        done()
      }).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/categories/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          ...data,
          id: asymmetricMatcher(actual => actual === ids.category)
        }
      }
    })
  })

  describe('PUT /:id', () => {
    const data = {
      eng_name: 'new en',
      fin_name: 'new fn',
      swe_name: 'new sn',
      order: 4.5
    }
    const options = {
      route: '/api/categories',
      method: 'put',
      preamble: {
        send: data,
        set: ['uid', 'mikkoti']
      }
    }
    const ids = {}
    const databaseExpectation = {}

    beforeAll((done) => {
      Category.create({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        course_instance_id: 1,
        order: 11
      }).then((result) => {
        ids.category = result.id
        options.route = `${options.route}/${ids.category}`
        databaseExpectation.created_at = result.created_at
        databaseExpectation.updated_at = result.updated_at
        done()
      }).catch(done)
    })

    afterEach((done) => {
      Category.findByPk(ids.category).then(
        instance => instance.update({
          eng_name: 'en',
          fin_name: 'fn',
          swe_name: 'sn',
          order: 11
        }).then((result) => {
          databaseExpectation.updated_at = result.updated_at
          done()
        }).catch(done)
      ).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/categories/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.category),
          order: data.order
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
        id: asymmetricMatcher(actual => actual === ids.category),
        course_instance_id: 1,
        created_at: asymmetricMatcher(actual => !(
          actual < databaseExpectation.created_at || actual > databaseExpectation.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.updated_at)
      },
      Category,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })
})
