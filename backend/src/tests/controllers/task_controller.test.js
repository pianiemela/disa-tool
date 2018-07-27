const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy
} = require('../testUtils')
const { Task, TaskType, TaskObjective } = require('../../database/models.js')

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
    let newId

    beforeEach((done) => {
      Task.create({
        course_instance_id: 1,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn'
      }).then((result) => {
        newId = result.get({ plain: true }).id
        options.route = `/api/tasks/${newId}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: expect.any(Number)
        }
      }
    })

    describe('deletion cascades', () => {
      const cascadeIds = {}
      beforeEach((done) => {
        let countdown = 2
        TaskType.create({
          task_id: newId,
          type_id: 1
        }).then((result) => {
          cascadeIds.task_type = result.get({ plain: true }).id
          countdown -= 1
          if (countdown === 0) {
            done()
          }
        })
        TaskObjective.create({
          task_id: newId,
          objective_id: 1,
          multiplier: 1
        }).then((result) => {
          cascadeIds.task_objective = result.get({ plain: true }).id
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
            getId: () => cascadeIds.task_type
          },
          {
            model: TaskObjective,
            getId: () => cascadeIds.task_objective
          }
        ]
      })
    })
  })
})
