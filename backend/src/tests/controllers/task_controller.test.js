const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { Task, TaskType, TaskObjective, TaskResponse, CoursePerson } = require('../../database/models.js')

describe('task_controller', () => {
  describe('POST /create', () => {
    const data = {
      course_instance_id: 1,
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn',
      eng_description: 'ed',
      fin_description: 'fd',
      swe_description: 'sd',
      info: 'test info'
    }
    const options = {
      route: '/api/tasks/create',
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
          id: expect.any(Number),
          info: data.info
        }
      },
      eng: {
        created: {
          name: data.eng_name,
          description: data.eng_description
        }
      },
      fin: {
        created: {
          name: data.fin_name,
          description: data.fin_description
        }
      },
      swe: {
        created: {
          name: data.swe_name,
          description: data.swe_description
        }
      }
    })

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        ...data
      },
      Task,
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
      Task.create({
        course_instance_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        ids.task = result.get({ plain: true }).id
        options.route = `/api/tasks/${ids.task}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.task)
        }
      }
    })

    describe('deletion cascades', () => {
      beforeEach((done) => {
        let countdown = 2
        TaskType.create({
          task_id: ids.task,
          type_id: 1
        }).then((result) => {
          ids.task_type = result.get({ plain: true }).id
          countdown -= 1
          if (countdown === 0) {
            done()
          }
        })
        TaskObjective.create({
          task_id: ids.task,
          objective_id: 1,
          multiplier: 1
        }).then((result) => {
          ids.task_objective = result.get({ plain: true }).id
          countdown -= 1
          if (countdown === 0) {
            done()
          }
        })
      })
      testDatabaseDestroy(options, Task, {
        delay: 2000,
        cascade: [
          {
            model: TaskType,
            getId: () => ids.task_type
          },
          {
            model: TaskObjective,
            getId: () => ids.task_objective
          }
        ]
      })
    })
  })

  describe('POST /responses', () => {
    describe('adding new response', () => {
      const courseInstanceId = 1
      const data = {
        courseId: 1,
        tasks: [{ points: 1 }]
      }
      // instead of database calls you could use hard coded person 422 and task 1.
      beforeAll(async () => {
        const task = await Task.findOne({ where: { course_instance_id: courseInstanceId } })
        const coursePerson = await CoursePerson.findOne({ where: { course_instance_id: courseInstanceId } })
        data.tasks[0].personId = coursePerson.person_id
        data.tasks[0].taskId = task.id
      })
      afterAll(async () => {
        const task = await Task.findOne({ where: { course_instance_id: courseInstanceId } })
        const coursePerson = await CoursePerson.findOne({ where: { course_instance_id: courseInstanceId } })
        await TaskResponse.destroy({ where: { person_id: coursePerson.person_id, task_id: task.id } })
      })

      describe('teacher can add', () => {
        const options = {
          route: '/api/tasks/responses',
          method: 'post',
          preamble: {
            send: data,
            set: ['Authorization', `Bearer ${tokens.teacher}`]
          }
        }
        testStatusCode(options, 201)
        // it('increases database length by one', async (done) => {
        //   const afterResponses = await TaskResponse.findAll()
        //   expect(afterResponses.length).toEqual(responses.length + 1)
        //   done()
        // })
      })
      describe('student cannot add', () => {
        const options = {
          route: '/api/tasks/responses',
          method: 'post',
          preamble: {
            send: data,
            set: ['Authorization', `Bearer ${tokens.student}`]
          }
        }
        testStatusCode(options, 403)
        // it('does not affect database length', async (done) => {
        //   const afterResponses = await TaskResponse.findAll()
        //   expect(afterResponses.length).toEqual(responses)
        //   done()
        // })
      })
    })
  })

  describe('GET /:id', () => {
    const options = {
      route: '/api/tasks/1',
      method: 'get',
      preamble: {}
    }
    const expectedBody = {
      common: {
        message: expect.any(String),
        data: {
          id: 1,
          course_instance_id: 1
        }
      }
    }

    beforeAll((done) => {
      Task.findById(1).then((result) => {
        expectedBody.common.data.eng_name = result.eng_name
        expectedBody.common.data.fin_name = result.fin_name
        expectedBody.common.data.swe_name = result.swe_name
        expectedBody.common.data.eng_description = result.eng_description
        expectedBody.common.data.fin_description = result.fin_description
        expectedBody.common.data.swe_description = result.swe_description
        expectedBody.common.data.info = result.info
        done()
      })
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/types/999999' }, 404)

    testBody(options, expectedBody)
  })

  describe('PUT /:id', () => {
    const data = {
      eng_name: 'new en',
      fin_name: 'new fn',
      swe_name: 'new sn',
      eng_description: 'new ed',
      fin_description: 'new fd',
      swe_description: 'new sd',
      info: 'new i'
    }
    const options = {
      route: '/api/tasks',
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const ids = {}
    const databaseExpectation = {}

    beforeAll((done) => {
      Task.create({
        course_instance_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        eng_description: 'ed',
        fin_description: 'fd',
        swe_description: 'sd',
        info: 'i'
      }).then((result) => {
        ids.task = result.id
        options.route = `${options.route}/${ids.task}`
        databaseExpectation.created_at = result.created_at
        done()
      })
    })

    beforeEach((done) => {
      Task.findById(ids.task).then(instance => instance.update({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        eng_description: 'ed',
        fin_description: 'fd',
        swe_description: 'sd',
        info: 'i'
      }).then(() => done()))
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/tasks/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.task),
          info: data.info
        }
      },
      eng: {
        edited: {
          name: data.eng_name,
          description: data.eng_description
        }
      },
      fin: {
        edited: {
          name: data.fin_name,
          description: data.fin_description
        }
      },
      swe: {
        edited: {
          name: data.swe_name,
          description: data.swe_description
        }
      }
    })

    testDatabaseSave(
      options,
      {
        ...data,
        id: asymmetricMatcher(actual => actual === ids.task),
        course_instance_id: 1,
        created_at: asymmetricMatcher(actual => !(
          actual < databaseExpectation.created_at || actual > databaseExpectation.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.created_at)
      },
      Task,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })
})
