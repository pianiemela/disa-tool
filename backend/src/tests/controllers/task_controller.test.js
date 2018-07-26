const { testTeacherOnCoursePrivilege, testHeaders, testBody, testDatabaseSave } = require('../testUtils')
const { Task } = require('../../database/models.js')

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
      message: expect.any(String),
      created: {
        id: expect.any(Number),
        name: data.fin_name,
        description: data.fin_description,
        info: data.info
      }
    })

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        ...data
      },
      Task
    )
  })
})