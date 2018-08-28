const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { Task, TaskType, TaskObjective, TaskResponse, CoursePerson, Person } = require('../../database/models.js')

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

    testStatusCode({ ...options, route: '/api/tasks/999999' }, 404)

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
      const options = {
        route: '/api/tasks/responses',
        method: 'post',
        preamble: {
          send: data,
          set: ['Authorization', `Bearer ${tokens.teacher}`]
        }
      }
      // instead of database calls you could use hard coded person 422 and task 1.
      beforeAll((done) => {
        Task.findOne({
          where: {
            course_instance_id: courseInstanceId
          },
          attributes: ['id', 'course_instance_id'],
          include: {
            model: Person,
            attributes: ['id', 'studentnumber']
          }
        }).then((result) => {
          data.tasks[0].personId = result.get({ plain: true }).people[0].id
          data.tasks[0].taskId = result.get({ plain: true }).id
          TaskResponse.destroy({ where: {} })
            .then(() => done())
            .catch(done)
        }).catch(done)
      })

      afterEach((done) => {
        TaskResponse.destroy({ where: {} })
          .then(() => done())
          .catch(done)
      })

      testHeaders(options)

      testTeacherOnCoursePrivilege(options, { success: 201 })

      testBody(options, {
        common: {
          message: expect.any(String),
          createdResponses: [
            {
              id: expect.any(Number),
              points: data.tasks[0].points,
              task_id: asymmetricMatcher(actual => actual === data.tasks[0].taskId),
              person_id: asymmetricMatcher(actual => actual === data.tasks[0].personId)
            }
          ]
        }
      })

      testDatabaseSave(
        options,
        {
          id: expect.any(Number),
          points: data.tasks[0].points,
          task_id: asymmetricMatcher(actual => actual === data.tasks[0].taskId),
          person_id: asymmetricMatcher(actual => actual === data.tasks[0].personId)
        },
        TaskResponse,
        {
          pathToId: ['body', 'createdResponses', 0, 'id']
        }
      )
    })

    describe('updating an existing response', () => {
      const data = {
        courseId: 1,
        tasks: [{
          points: 1
        }]
      }
      const options = {
        route: '/api/tasks/responses',
        method: 'post',
        preamble: {
          send: data,
          set: ['Authorization', `Bearer ${tokens.teacher}`]
        }
      }
      const databaseExpectation = {}

      beforeAll((done) => {
        Task.create({
          course_instance_id: 1,
          eng_name: '',
          fin_name: '',
          swe_name: '',
          eng_description: '',
          fin_description: '',
          swe_description: '',
          info: '',
          max_points: 2
        }).then((task) => {
          data.tasks[0].taskId = task.get({ plain: true }).id
          Person.create({
            studentnumber: '019999999',
            name: ''
          }).then((person) => {
            data.tasks[0].personId = person.get({ plain: true }).id
            TaskResponse.create({
              points: 0,
              task_id: data.tasks[0].taskId,
              person_id: data.tasks[0].personId
            }).then((trResult) => {
              data.tasks[0].responseId = trResult.get({ plain: true }).id
              databaseExpectation.created_at = trResult.get({ plain: true }).created_at
              done()
            }).catch(done)
          }).catch(done)
        }).catch(done)
      })
      afterEach((done) => {
        TaskResponse.findById(data.tasks[0].responseId).then((result) => {
          result.update({
            points: 0
          }).then(() => done()).catch(done)
        }).catch(done)
      })

      testHeaders(options)

      testTeacherOnCoursePrivilege(options, { success: 201 })

      testBody(options, {
        common: {
          message: expect.any(String),
          createdResponses: [
            {
              id: asymmetricMatcher(actual => actual === data.tasks[0].responseId),
              points: data.tasks[0].points,
              task_id: asymmetricMatcher(actual => actual === data.tasks[0].taskId),
              person_id: asymmetricMatcher(actual => actual === data.tasks[0].personId)
            }
          ]
        }
      })

      testDatabaseSave(
        options,
        {
          id: asymmetricMatcher(actual => actual === data.tasks[0].responseId),
          points: data.tasks[0].points,
          task_id: asymmetricMatcher(actual => actual === data.tasks[0].taskId),
          person_id: asymmetricMatcher(actual => actual === data.tasks[0].personId),
          created_at: asymmetricMatcher(actual => !(
            actual > databaseExpectation.created_at || actual < databaseExpectation.created_at
          )),
          updated_at: asymmetricMatcher(actual => actual > databaseExpectation.created_at)
        },
        TaskResponse,
        {
          pathToId: ['body', 'createdResponses', 0, 'id'],
          includeTimestamps: false
        }
      )
    })

    describe('adding new response to person who does not exist in database', () => {
      const courseInstanceId = 1
      const studentnumber = '019999999'
      const data = {
        courseId: courseInstanceId,
        tasks: [{ points: 1, studentnumber }]
      }
      const options = {
        route: '/api/tasks/responses',
        method: 'post',
        preamble: {
          send: data,
          set: ['Authorization', `Bearer ${tokens.teacher}`]
        }
      }
      // instead of database calls you could use hard coded person 422 and task 1.
      beforeAll((done) => {
        Task.findOne({
          where: {
            course_instance_id: courseInstanceId
          },
          attributes: ['id', 'course_instance_id'],
          include: {
            model: Person,
            attributes: ['id', 'studentnumber']
          }
        }).then((result) => {
          data.tasks[0].taskId = result.get({ plain: true }).id
          done()
        }).catch(done)
      })

      afterEach((done) => {
        Promise.all([
          TaskResponse.destroy({ where: {} }).catch(done),
          Person.destroy({ where: { studentnumber } }).catch(done)
        ])
          .then(() => done())
      })

      testHeaders(options)

      testTeacherOnCoursePrivilege(options, { success: 201 })

      testBody(options, {
        common: {
          message: expect.any(String),
          createdResponses: [
            {
              id: expect.any(Number),
              points: data.tasks[0].points,
              task_id: asymmetricMatcher(actual => actual === data.tasks[0].taskId),
              person_id: expect.any(Number)
            }
          ]
        }
      })

      testDatabaseSave(
        options,
        {
          id: expect.any(Number),
          points: data.tasks[0].points,
          task_id: asymmetricMatcher(actual => actual === data.tasks[0].taskId),
          person_id: expect.any(Number)
        },
        TaskResponse,
        {
          pathToId: ['body', 'createdResponses', 0, 'id']
        }
      )
    })

    describe('validation', () => {
      const baseData = {
        courseId: 1,
        tasks: [{
          points: 1
        }]
      }
      const baseOptions = {
        route: '/api/tasks/responses',
        method: 'post',
        preamble: {
          set: ['Authorization', `Bearer ${tokens.teacher}`]
        }
      }

      describe('Disallow responses pointing to a non-existent task.', () => {
        const data = {
          ...baseData,
          tasks: [{
            ...baseData.tasks[0],
            personId: 421,
            taskId: 999999
          }]
        }
        const options = {
          ...baseOptions,
          preamble: {
            ...baseOptions.preamble,
            send: data
          }
        }

        testBody(options, {
          common: {
            message: expect.any(String),
            createdResponses: asymmetricMatcher(actual => actual.length === 0)
          }
        })
      })

      describe('Disallow responses pointing to an alien task.', () => {
        const data = {
          ...baseData,
          tasks: [{
            ...baseData.tasks[0],
            personId: 421
          }]
        }
        const options = {
          ...baseOptions,
          preamble: {
            ...baseOptions.preamble,
            send: data
          }
        }

        beforeAll((done) => {
          Task.findOne({
            where: {
              course_instance_id: 2
            }
          }).then((result) => {
            data.tasks[0].taskId = result.get({ plain: true }).id
            CoursePerson.create({
              course_instance_id: 2,
              person_id: 424,
              role: 'TEACHER'
            }).then(() => done()).catch(done)
          }).catch(done)
        })

        afterAll((done) => {
          CoursePerson.destroy({
            where: {
              course_instance_id: 2,
              person_id: 424,
              role: 'TEACHER'
            }
          }).then(() => done()).catch(done)
        })

        testBody(options, {
          common: {
            message: expect.any(String),
            createdResponses: asymmetricMatcher(actual => actual.length === 0)
          }
        })
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
