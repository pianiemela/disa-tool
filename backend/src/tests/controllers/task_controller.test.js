const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { Task, TaskType, TaskObjective, TaskResponse, CoursePerson, CourseInstance } = require('../../database/models.js')

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
})
