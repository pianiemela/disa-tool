const {
  testGlobalTeacherPrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testStatusCode,
  testTeacherOnCoursePrivilege,
  asymmetricMatcher
} = require('../testUtils')
const { Course, CourseInstance, CoursePerson } = require('../../database/models.js')

describe('course_controller', () => {
  describe('POST /create', () => {
    const data = {
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn'
    }
    const options = {
      route: '/api/courses/create',
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

    testDatabaseSave(options, {
      ...data,
      id: expect.any(Number)
    }, Course)
  })

  describe('GET /', () => {
    const options = {
      method: 'get',
      route: '/api/courses/',
      preamble: {}
    }

    const expectations = { courses: [] }

    beforeAll((done) => {
      Course.findAll().then((courses) => {
        courses.forEach(() => expectations.courses.push({
          id: expect.any(Number),
          name: expect.any(String)
        }))
        done()
      }).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testBody(options, {
      common: expectations.courses
    })
  })

  describe('PUT /instance/:courseId/toggle', () => {
    const courseInstanceData = {
      course_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn',
      active: false
    }
    const data = {}

    const options = {
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    const ids = {}

    beforeAll((done) => {
      CourseInstance.create(courseInstanceData).then((courseInstance) => {
        ids.courseInstance = courseInstance.id
        options.route = `/api/courses/instance/${courseInstance.id}/toggle`
        CoursePerson.create({
          role: 'TEACHER',
          course_instance_id: courseInstance.id,
          person_id: 424
        }).then(() => done()).catch(done)
      }).catch(done)
    })

    afterEach((done) => {
      CourseInstance.update(courseInstanceData, {
        where: {
          id: ids.courseInstance
        }
      }).then(() => done()).catch(done)
    })

    afterAll((done) => {
      CourseInstance.destroy({
        where: {
          id: ids.courseInstance
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        ...courseInstanceData,
        active: !courseInstanceData.active,
        id: asymmetricMatcher(actual => actual === ids.courseInstance)
      }
    })

    testDatabaseSave(
      options,
      {
        ...courseInstanceData,
        active: !courseInstanceData.active,
        id: asymmetricMatcher(actual => actual === ids.courseInstance)
      },
      CourseInstance,
      {
        pathToId: ['body', 'id']
      }
    )
  })
})
