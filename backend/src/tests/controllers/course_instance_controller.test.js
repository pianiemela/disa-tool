const {
  makeRequest,
  testHeaders,
  testStatusCode,
  testTeacherOnCoursePrivilege,
  testGlobalTeacherPrivilege,
  testBody,
  testDatabaseSave,
  asymmetricMatcher
} = require('../testUtils')
const {
  CourseInstance,
  CoursePerson,
  Category,
  CategoryGrade,
  SkillLevel,
  Objective,
  Grade,
  Task,
  TaskObjective,
  TaskType,
  TypeHeader,
  Type
} = require('../../database/models.js')

const names = ['eng_name', 'fin_name', 'swe_name']
const descriptions = ['eng_description', 'fin_description', 'swe_description']
const findCopyData = id => CourseInstance.findByPk(id, {
  attributes: ['id', ...names, 'course_id'],
  include: [
    {
      model: Category,
      attributes: ['id', ...names, 'order'],
      include: {
        model: CategoryGrade,
        attributes: ['id', 'grade_id', 'category_id', 'needed_for_grade'],
        separate: true
      }
    },
    {
      model: SkillLevel,
      attributes: ['id', ...names, 'order'],
      include: [
        {
          model: Objective,
          attributes: ['id', ...names, 'course_instance_id', 'skill_level_id', 'category_id', 'order'],
          separate: true
        },
        {
          model: Grade,
          attributes: ['id', ...names, 'needed_for_grade', 'skill_level_id', 'prerequisite', 'order'],
          separate: true
        }
      ]
    },
    {
      model: Task,
      attributes: ['id', ...names, 'info', ...descriptions, 'max_points', 'order'],
      include: [
        {
          model: TaskObjective,
          attributes: ['task_id', 'multiplier', 'objective_id'],
          separate: true
        },
        {
          model: TaskType,
          attributes: ['task_id', 'type_id'],
          separate: true
        }
      ]
    },
    {
      model: TypeHeader,
      attributes: ['id', ...names, 'order'],
      include: {
        model: Type,
        attributes: ['id', ...names, 'multiplier', 'type_header_id', 'order'],
        separate: true
      }
    }
  ]
})
const recursiveMatch = (expected, actual) => {
  Object.entries(expected).forEach(([key, value]) => {
    if (typeof value === 'object' && value) {
      if (Array.isArray(value)) {
        let result = true
        value.forEach((expectedElement) => {
          let matched = false
          actual[key].forEach((actualElement) => {
            try {
              recursiveMatch(expectedElement, actualElement)
              matched = true
            // eslint-disable-next-line no-empty
            } catch (e) {}
          })
          result = result && matched
        })
        if (!result) {
          throw new Error(`attribute ${key} did not contain all required values.`)
        }
      } else {
        recursiveMatch(value, actual[key])
      }
    } else if (key === 'id' || (key.length >= 3 && key.substring(key.length - 3, key.length) === '_id')) {
      // expect(actual[key]).toBeInstanceOf(Number)
    } else {
      expect(actual[key]).toEqual(value)
    }
  })
}

describe('course_instance_controller', () => {
  describe('GET /data/:courseInstanceId', () => {
    const options = {
      route: '/api/course-instances/data/1',
      method: 'get',
      preamble: {}
    }

    testHeaders(options)

    testStatusCode(options, 200)
  })

  describe('POST /create', () => {
    const data = {
      course_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn'
    }
    const options = {
      route: '/api/course-instances/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    testHeaders(options)

    testGlobalTeacherPrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number),
          active: false,
          registered: 'TEACHER'
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
        ...data,
        active: false,
        id: expect.any(Number)
      },
      CourseInstance,
      {
        disallowId: true
      }
    )
  })

  describe('POST /copy', () => {
    const data = {
      course_id: 1,
      course_instance_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn'
    }
    const options = {
      route: '/api/course-instances/copy',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    testHeaders(options)

    testGlobalTeacherPrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number),
          active: false,
          registered: 'TEACHER'
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

    it('Copy is identical', (done) => {
      makeRequest(options).then((response) => {
        const copyId = response.body.created.id
        Promise.all([
          findCopyData(data.course_instance_id),
          findCopyData(copyId)
        ]).then(([expected, actual]) => {
          const expectedJSON = {
            ...expected.toJSON(),
            eng_name: data.eng_name,
            fin_name: data.fin_name,
            swe_name: data.swe_name
          }
          const actualJSON = actual.toJSON()
          try {
            recursiveMatch(
              expectedJSON,
              actualJSON
            )
            done()
          } catch (e) {
            done({
              error: e,
              expected: expectedJSON,
              received: actualJSON
            })
          }
        }).catch(done)
      }).catch(done)
    })
  })

  describe('GET /edit/:id', () => {
    const options = {
      route: '/api/course-instances/edit',
      method: 'get',
      preamble: {}
    }
    const ids = {}

    beforeAll((done) => {
      CourseInstance.create({
        course_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        ids.courseInstance = result.get({ plain: true }).id
        options.route = `${options.route}/${ids.courseInstance}`
        done()
      }).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/course-instances/edit/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          id: asymmetricMatcher(actual => actual === ids.courseInstance),
          course_id: 1,
          eng_name: 'en',
          fin_name: 'fn',
          swe_name: 'sn'
        }
      }
    })
  })

  describe('PUT /edit/:id', () => {
    const data = {
      eng_name: 'new en',
      fin_name: 'new fn',
      swe_name: 'new sn'
    }
    const options = {
      route: '/api/course-instances/edit',
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const ids = {}
    const databaseExpectation = {}

    beforeAll((done) => {
      CourseInstance.create({
        course_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        ids.courseInstance = result.id
        databaseExpectation.created_at = result.created_at
        databaseExpectation.updated_at = result.updated_at
        options.route = `${options.route}/${ids.courseInstance}`
        CoursePerson.create({
          person_id: 424,
          course_instance_id: ids.courseInstance,
          role: 'TEACHER'
        }).then(() => done()).catch(done)
      }).catch(done)
    })

    afterEach((done) => {
      CourseInstance.findById(ids.courseInstance).then((ci) => {
        ci.update({
          eng_name: 'en',
          fin_name: 'fn',
          swe_name: 'sn'
        }).then((result) => {
          databaseExpectation.updated_at = result.updated_at
          done()
        }).catch(done)
      }).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/course-instances/edit/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.courseInstance),
          course_id: 1
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
        id: asymmetricMatcher(actual => actual === ids.courseInstance),
        course_id: 1,
        created_at: asymmetricMatcher(actual => !(
          actual > databaseExpectation.created_at
          || actual < databaseExpectation.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.updated_at)
      },
      CourseInstance,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })
})
