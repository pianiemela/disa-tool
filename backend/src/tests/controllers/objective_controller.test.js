const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { Objective, Category, SkillLevel } = require('../../database/models.js')

describe('objective_controller', () => {
  describe('POST /create', () => {
    const data = {
      course_instance_id: 1,
      category_id: 1,
      skill_level_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn',
      order: 2
    }
    const options = {
      route: '/api/objectives/create',
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
          category_id: 1,
          skill_level_id: 1,
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
      Objective,
      {
        disallowId: true
      }
    )

    describe('will not allow referring to an object on another course instance', () => {
      it('with category_id.', (done) => {
        Category.findOne({
          where: {
            course_instance_id: 2
          },
          attributes: ['id']
        }).then((alienCategory) => {
          server
            .post(options.route)
            .send({ ...data, category_id: alienCategory.toJSON().id })
            .set(...options.preamble.set)
            .then((response) => {
              expect(response.status).not.toEqual(200)
              done()
            })
        })
      })

      it('with skill_level_id.', (done) => {
        SkillLevel.findOne({
          where: {
            course_instance_id: 2
          },
          attributes: ['id']
        }).then((alienLevel) => {
          server
            .post(options.route)
            .send({ ...data, skill_level_id: alienLevel.toJSON().id })
            .set(...options.preamble.set)
            .then((response) => {
              expect(response.status).not.toEqual(200)
              done()
            })
        })
      })
    })
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
      Objective.create({
        course_instance_id: 1,
        category_id: 1,
        skill_level_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        order: 1
      }).then((result) => {
        ids.objective = result.get({ plain: true }).id
        options.route = `/api/objectives/${ids.objective}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testStatusCode({ ...options, route: '/api/objectives/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.objective),
          category_id: 1,
          skill_level_id: 1,
          task_ids: []
        }
      }
    })

    testDatabaseDestroy(options, Objective, { delay: 2000 })
  })

  describe('GET /:id', () => {
    const options = {
      route: '/api/objectives',
      method: 'get',
      preamble: {}
    }
    const ids = {}

    beforeAll((done) => {
      Objective.create({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        course_instance_id: 1,
        skill_level_id: 1,
        category_id: 1,
        order: 4
      }).then((result) => {
        ids.objective = result.get({ plain: true }).id
        options.route = `${options.route}/${ids.objective}`
        done()
      }).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/objectives/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          eng_name: 'en',
          fin_name: 'fn',
          swe_name: 'sn',
          course_instance_id: 1,
          skill_level_id: 1,
          category_id: 1,
          order: 4
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
      category_id: 2,
      order: 4.5
    }
    const options = {
      route: '/api/objectives',
      method: 'put',
      preamble: {
        send: data,
        set: ['uid', 'mikkoti']
      }
    }
    const ids = {}
    const databaseExpectation = {}

    beforeAll((done) => {
      Objective.create({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        course_instance_id: 1,
        skill_level_id: 1,
        category_id: 1,
        order: 11
      }).then((result) => {
        ids.objective = result.id
        options.route = `${options.route}/${ids.objective}`
        databaseExpectation.created_at = result.created_at
        databaseExpectation.updated_at = result.updated_at
        done()
      }).catch(done)
    })

    afterEach((done) => {
      Objective.findByPk(ids.objective).then(
        instance => instance.update({
          eng_name: 'en',
          fin_name: 'fn',
          swe_name: 'sn',
          skill_level_id: 1,
          category_id: 1,
          order: 11
        }).then((result) => {
          databaseExpectation.updated_at = result.updated_at
          done()
        }).catch(done)
      ).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/objectives/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.objective),
          skill_level_id: data.skill_level_id,
          category_id: data.category_id,
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
        id: asymmetricMatcher(actual => actual === ids.objective),
        created_at: asymmetricMatcher(actual => !(
          actual < databaseExpectation.created_at || actual > databaseExpectation.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.updated_at)
      },
      Objective,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })
})
