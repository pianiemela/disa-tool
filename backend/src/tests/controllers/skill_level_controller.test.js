const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { SkillLevel, Objective, CourseInstance, CoursePerson, Category } = require('../../database/models.js')

describe('skill level controller', () => {
  const courseInstanceData = {
    course_id: 1,
    eng_name: 'en',
    fin_name: 'fn',
    swe_name: 'sn',
    active: false
  }
  const categoryData = {
    eng_name: 'cen',
    fin_name: 'cfn',
    swe_name: 'csn',
    order: 1
  }
  const superIds = {}

  beforeAll((done) => {
    CourseInstance.create(courseInstanceData).then((courseInstance) => {
      superIds.courseInstance = courseInstance.id
      Promise.all([
        Category.create({
          ...categoryData,
          course_instance_id: courseInstance.id
        }),
        CoursePerson.create({
          person_id: 421,
          course_instance_id: courseInstance.id,
          role: 'STUDENT'
        }),
        CoursePerson.create({
          person_id: 424,
          course_instance_id: courseInstance.id,
          role: 'TEACHER'
        })
      ]).then(([category]) => {
        superIds.category = category.id
        done()
      }).catch(done)
    }).catch(done)
  })
  afterAll((done) => {
    CourseInstance.destroy({
      where: { id: superIds.courseInstance }
    }).then(() => done()).catch(done)
  })

  describe('POST /create', () => {
    const data = {
      eng_name: 'e_skill_level_unique_name',
      fin_name: 'f_skill_level_unique_name',
      swe_name: 's_skill_level_unique_name',
      order: 7
    }
    const options = {
      route: '/api/skill-levels/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    beforeAll(() => {
      data.course_instance_id = superIds.courseInstance
    })

    afterEach((done) => {
      SkillLevel.destroy({
        where: data
      }).then(() => done()).catch()
    })

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
        course_instance_id: asymmetricMatcher(actual => actual === superIds.courseInstance),
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
        course_instance_id: superIds.courseInstance,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        order: 1
      }).then((result) => {
        ids.skill_level = result.get({ plain: true }).id
        options.route = `/api/skill-levels/${ids.skill_level}`
        done()
      })
    })

    afterEach((done) => {
      SkillLevel.destroy({
        where: { id: ids.skill_level }
      }).then(() => done()).catch(done)
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
          course_instance_id: superIds.courseInstance,
          category_id: superIds.category,
          eng_name: 'eno',
          fin_name: 'fno',
          swe_name: 'sno',
          order: 1
        }).then((result) => {
          ids.objective = result.get({ plain: true }).id
          done()
        })
      })
      afterEach((done) => {
        Objective.destroy({
          where: { id: ids.objective }
        }).then(() => done()).catch(done)
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
      order: 11.5
    }
    const options = {
      route: '/api/skill-levels',
      method: 'get',
      preamble: {}
    }
    const ids = {}

    beforeAll((done) => {
      data.course_instance_id = superIds.courseInstance
      SkillLevel.create(data).then((result) => {
        ids.level = result.get({ plain: true }).id
        options.route = `${options.route}/${ids.level}`
        done()
      }).catch(done)
    })

    afterAll((done) => {
      SkillLevel.destroy({
        where: { id: ids.level }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/skill-levels/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          ...data,
          course_instance_id: asymmetricMatcher(actual => actual === superIds.courseInstance),
          id: asymmetricMatcher(actual => actual === ids.level)
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
        course_instance_id: superIds.courseInstance,
        order: 11
      }).then((result) => {
        ids.level = result.id
        options.route = `${options.route}/${ids.level}`
        databaseExpectation.created_at = result.created_at
        databaseExpectation.updated_at = result.updated_at
        done()
      }).catch(done)
    })

    afterEach((done) => {
      SkillLevel.findByPk(ids.level).then(
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

    afterAll((done) => {
      SkillLevel.destroy({
        where: { id: ids.level }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/skill-levels/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.level),
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
        id: asymmetricMatcher(actual => actual === ids.level),
        course_instance_id: asymmetricMatcher(actual => actual === superIds.courseInstance),
        created_at: asymmetricMatcher(actual => !(
          actual < databaseExpectation.created_at || actual > databaseExpectation.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.updated_at)
      },
      SkillLevel,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })
})
