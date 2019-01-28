const { Op } = require('sequelize')
const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const {
  Task,
  TaskType,
  TaskObjective,
  TaskResponse,
  CoursePerson,
  Person,
  Course,
  CourseInstance,
  Objective,
  TypeHeader,
  Type
} = require('../../database/models.js')

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
      info: 'test info',
      order: 111
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
          info: data.info,
          order: data.order
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
        swe_name: 'sn',
        order: 1
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
        expectedBody.common.data.order = result.order
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
      info: 'new i',
      order: 4.5
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
        info: 'i',
        order: 11
      }).then((result) => {
        ids.task = result.id
        options.route = `${options.route}/${ids.task}`
        databaseExpectation.created_at = result.created_at
        databaseExpectation.updated_at = result.updated_at
        done()
      })
    })

    afterEach((done) => {
      Task.findById(ids.task).then(instance => instance.update({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        eng_description: 'ed',
        fin_description: 'fd',
        swe_description: 'sd',
        info: 'i',
        order: 11
      }).then((result) => {
        databaseExpectation.updated_at = result.updated_at
        done()
      }).catch(done)
      ).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/tasks/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.task),
          info: data.info,
          order: data.order
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
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.updated_at)
      },
      Task,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })

  describe('GET /user/:courseId', () => {
    const taskData = {
      eng_name: 'te',
      fin_name: 'tf',
      swe_name: 'ts',
      eng_description: 'tde',
      fin_description: 'tdf',
      swe_description: 'tds',
      max_points: 3,
      info: 'ti',
      order: 1
    }
    const taskResponseData = {
      points: 2,
      person_id: 421
    }
    const typeHeaderData = {
      eng_name: 'the',
      fin_name: 'thf',
      swe_name: 'ths',
      order: 1
    }
    const typeData = {
      eng_name: 'te',
      fin_name: 'tf',
      swe_name: 'ts',
      multiplier: 0.4,
      order: 1
    }

    const options = {
      method: 'get',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.student}`]
      }
    }

    const ids = {}

    beforeAll((done) => {
      Course.create({
        eng_name: 'ce',
        fin_name: 'cf',
        swe_name: 'cs'
      }).then((course) => {
        ids.course = course.id
        CourseInstance.create({
          course_id: course.id,
          eng_name: 'cie',
          fin_name: 'cif',
          swe_name: 'cis'
        }).then((courseInstance) => {
          ids.courseInstance = courseInstance.id
          options.route = `/api/tasks/user/${courseInstance.id}`
          Promise.all([
            Task.create({
              ...taskData,
              course_instance_id: courseInstance.id
            }),
            TypeHeader.create({
              ...typeHeaderData,
              course_instance_id: courseInstance.id
            })
          ]).then(([task, typeHeader]) => {
            ids.task = task.id
            ids.type_header = typeHeader.id
            Promise.all([
              CoursePerson.create({
                person_id: 421,
                course_instance_id: courseInstance.id,
                role: 'STUDENT'
              }),
              TaskResponse.create({
                ...taskResponseData,
                task_id: task.id
              }),
              Type.create({
                ...typeData,
                type_header_id: typeHeader.id
              })
            ]).then(([, , type]) => {
              ids.type = type.id
              TaskType.create({
                task_id: task.id,
                type_id: type.id
              }).then(() => done()).catch(done)
            }).catch(done)
          }).catch(done)
        }).catch(done)
      }).catch(done)
    })

    afterAll((done) => {
      Course.destroy({
        where: {
          id: ids.course
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testBody(options, {
      common: [{
        id: asymmetricMatcher(actual => actual === ids.task),
        max_points: taskData.max_points,
        task_responses: [{
          ...taskResponseData,
          task_id: asymmetricMatcher(actual => actual === ids.task)
        }]
      }],
      eng: [{
        name: taskData.eng_name,
        description: taskData.eng_description,
        types: [{
          id: asymmetricMatcher(actual => actual === ids.type),
          name: typeData.eng_name,
          type_header: {
            id: asymmetricMatcher(actual => actual === ids.type_header),
            name: typeHeaderData.eng_name
          }
        }]
      }],
      fin: [{
        name: taskData.fin_name,
        description: taskData.fin_description,
        types: [{
          id: asymmetricMatcher(actual => actual === ids.type),
          name: typeData.fin_name,
          type_header: {
            id: asymmetricMatcher(actual => actual === ids.type_header),
            name: typeHeaderData.fin_name
          }
        }]
      }],
      swe: [{
        name: taskData.swe_name,
        description: taskData.swe_description,
        types: [{
          id: asymmetricMatcher(actual => actual === ids.type),
          name: typeData.swe_name,
          type_header: {
            id: asymmetricMatcher(actual => actual === ids.type_header),
            name: typeHeaderData.swe_name
          }
        }]
      }]
    })

    testBody(
      { ...options, route: '/api/tasks/user/999999' },
      {
        common: []
      },
      {
        text: {
          describe: 'when course instance doesn\'t exist, returns an empty array in response body'
        }
      }
    )
  })

  describe('POST /objectives/attach', () => {
    const objectiveData = {
      eng_name: 'e',
      fin_name: 'f',
      swe_name: 's',
      order: 100
    }
    const taskData = {
      eng_name: 'te',
      fin_name: 'tf',
      swe_name: 'ts',
      eng_description: 'tde',
      fin_description: 'tdf',
      swe_description: 'tds',
      max_points: 3,
      info: 'ti',
      order: 100
    }
    const data = {}

    const options = {
      method: 'post',
      route: '/api/tasks/objectives/attach',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    const ids = {}

    beforeAll((done) => {
      Promise.all([
        Objective.create({
          ...objectiveData,
          course_instance_id: 1,
          category_id: 1,
          skill_level_id: 1
        }),
        Task.create({
          ...taskData,
          course_instance_id: 1
        })
      ]).then(([objective, task]) => {
        ids.objective = objective.id
        ids.task = task.id
        data.objective_id = objective.id
        data.task_id = task.id
        done()
      }).catch(done)
    })

    afterAll((done) => {
      Promise.all([
        Objective.destroy({
          where: {
            id: ids.objective
          }
        }),
        Task.destroy({
          where: {
            id: ids.task
          }
        })
      ]).then(() => done()).catch(done)
    })

    afterEach((done) => {
      TaskObjective.destroy({
        where: {
          task_id: ids.task,
          objective_id: ids.objective
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          task_id: asymmetricMatcher(actual => actual === data.task_id),
          objective_id: asymmetricMatcher(actual => actual === data.objective_id)
        }
      }
    })

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        task_id: asymmetricMatcher(actual => actual === data.task_id),
        objective_id: asymmetricMatcher(actual => actual === data.objective_id),
        multiplier: expect.any(Number),
        modified: false
      },
      TaskObjective,
      {
        findBy: () => ({
          where: {
            task_id: ids.task,
            objective_id: ids.objective
          }
        })
      }
    )

    describe('responds with an error code when', () => {
      describe('task is not found', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble = {
            ...options.preamble,
            send: { ...data, task_id: 999999 }
          }
        })
        testStatusCode(derivativeOptions, 404)
      })

      describe('objective is not found', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble = {
            ...options.preamble,
            send: { ...data, objective_id: 999999 }
          }
        })
        testStatusCode(derivativeOptions, 404)
      })

      describe('task and objective are from different course instances', () => {
        const derivativeOptions = { ...options }
        beforeAll((done) => {
          Task.create({
            ...taskData,
            course_instance_id: 2
          }).then((task) => {
            derivativeOptions.preamble = {
              ...options.preamble,
              send: { ...data, task_id: task.id }
            }
            ids.alien_task = task.id
            done()
          }).catch(done)
        })

        afterAll((done) => {
          Task.destroy({
            where: {
              id: ids.alien_task
            }
          }).then(() => done()).catch(done)
        })

        testStatusCode(derivativeOptions, 400)
      })
    })
  })

  describe('POST /objectives/detach', () => {
    const objectiveData = {
      eng_name: 'e',
      fin_name: 'f',
      swe_name: 's',
      order: 100
    }
    const taskData = {
      eng_name: 'te',
      fin_name: 'tf',
      swe_name: 'ts',
      eng_description: 'tde',
      fin_description: 'tdf',
      swe_description: 'tds',
      max_points: 3,
      info: 'ti',
      order: 100
    }
    const data = {}

    const options = {
      method: 'post',
      route: '/api/tasks/objectives/detach',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    const ids = {}

    beforeAll((done) => {
      Promise.all([
        Objective.create({
          ...objectiveData,
          course_instance_id: 1,
          category_id: 1,
          skill_level_id: 1
        }),
        Task.create({
          ...taskData,
          course_instance_id: 1
        })
      ]).then(([objective, task]) => {
        ids.objective = objective.id
        ids.task = task.id
        data.objective_id = objective.id
        data.task_id = task.id
        done()
      }).catch(done)
    })

    beforeEach((done) => {
      TaskObjective.create({
        task_id: ids.task,
        objective_id: ids.objective,
        multiplier: 1
      }).then((taskObjective) => {
        ids.taskObjective = taskObjective.id
        done()
      }).catch(() => done())
    })

    afterEach((done) => {
      TaskObjective.destroy({
        where: {
          id: ids.taskObjective
        }
      }).then(() => done()).catch(done)
    })

    afterAll((done) => {
      Promise.all([
        Objective.destroy({
          where: {
            id: ids.objective
          }
        }),
        Task.destroy({
          where: {
            id: ids.task
          }
        })
      ]).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          task_id: asymmetricMatcher(actual => actual === data.task_id),
          objective_id: asymmetricMatcher(actual => actual === data.objective_id)
        }
      }
    })

    testDatabaseDestroy(
      options,
      TaskObjective,
      {
        delay: 2000,
        findBy: () => ids.taskObjective
      }
    )

    describe('responds with an error code when', () => {
      describe('task is not found', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble = {
            ...options.preamble,
            send: { ...data, task_id: 999999 }
          }
        })
        testStatusCode(derivativeOptions, 404)
      })

      describe('objective is not found', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble = {
            ...options.preamble,
            send: { ...data, objective_id: 999999 }
          }
        })
        testStatusCode(derivativeOptions, 404)
      })

      describe('task_objective is not found', () => {
        beforeEach((done) => {
          TaskObjective.destroy({
            where: {
              task_id: ids.task,
              objective_id: ids.objective
            }
          }).then(() => done()).catch(done)
        })
        testStatusCode(options, 404)
      })
    })
  })

  describe('POST /objectives/edit', () => {
    const objectiveData = {
      eng_name: 'e',
      fin_name: 'f',
      swe_name: 's',
      order: 100
    }
    const taskData = {
      eng_name: 'te',
      fin_name: 'tf',
      swe_name: 'ts',
      eng_description: 'tde',
      fin_description: 'tdf',
      swe_description: 'tds',
      max_points: 3,
      info: 'ti',
      order: 100
    }
    const taskObjectiveData = {
      multiplier: 1,
      modified: false
    }
    const data = {
      objectives: [{
        multiplier: 0.6,
        modified: true
      }]
    }

    const options = {
      method: 'post',
      route: '/api/tasks/objectives/edit',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    const ids = {}

    beforeAll((done) => {
      Promise.all([
        Objective.create({
          ...objectiveData,
          course_instance_id: 1,
          category_id: 1,
          skill_level_id: 1
        }),
        Task.create({
          ...taskData,
          course_instance_id: 1
        })
      ]).then(([objective, task]) => {
        ids.objective = objective.id
        ids.task = task.id
        data.objectives[0].id = objective.id
        data.task_id = task.id
        TaskObjective.create({
          ...taskObjectiveData,
          task_id: task.id,
          objective_id: objective.id
        }).then((taskObjective) => {
          ids.taskObjective = taskObjective.id
          done()
        }).catch(done)
      }).catch(done)
    })

    beforeEach((done) => {
      TaskObjective.update({
        ...taskObjectiveData
      }, {
        where: {
          id: ids.taskObjective
        }
      }).then(() => done()).catch(() => done())
    })

    afterAll((done) => {
      Promise.all([
        Objective.destroy({
          where: {
            id: ids.objective
          }
        }),
        Task.destroy({
          where: {
            id: ids.task
          }
        })
      ]).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          task_id: asymmetricMatcher(actual => actual === ids.task),
          task_objectives: [{
            multiplier: data.objectives[0].multiplier,
            modified: data.objectives[0].modified,
            objective_id: asymmetricMatcher(actual => actual === ids.objective)
          }]
        }
      }
    })

    testDatabaseSave(
      options,
      {
        task_id: asymmetricMatcher(actual => actual === ids.task),
        objective_id: asymmetricMatcher(actual => actual === ids.objective),
        multiplier: data.objectives[0].multiplier,
        modified: data.objectives[0].modified
      },
      TaskObjective,
      {
        findBy: () => ids.taskObjective
      }
    )
  })

  describe('POST /types/attach', () => {
    const typeHeaderData = {
      eng_name: 'the',
      fin_name: 'thf',
      swe_name: 'ths',
      order: 100
    }
    const taskData = {
      eng_name: 'te',
      fin_name: 'tf',
      swe_name: 'ts',
      eng_description: 'tde',
      fin_description: 'tdf',
      swe_description: 'tds',
      max_points: 3,
      info: 'ti',
      order: 100
    }
    const typeData = {
      eng_name: 'tye',
      fin_name: 'tyf',
      swe_name: 'tys',
      multiplier: 0.4,
      order: 1
    }
    const data = {}

    const options = {
      method: 'post',
      route: '/api/tasks/types/attach',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    const ids = {}

    beforeAll((done) => {
      Promise.all([
        TypeHeader.create({
          ...typeHeaderData,
          course_instance_id: 1
        }),
        Task.create({
          ...taskData,
          course_instance_id: 1
        })
      ]).then(([typeHeader, task]) => {
        ids.type_header = typeHeader.id
        ids.task = task.id
        data.task_id = task.id
        Type.create({
          ...typeData,
          type_header_id: typeHeader.id
        }).then((type) => {
          ids.type = type.id
          data.type_id = type.id
          done()
        }).catch(done)
      }).catch(done)
    })

    afterAll((done) => {
      Promise.all([
        TypeHeader.destroy({
          where: {
            id: ids.type_header
          }
        }),
        Task.destroy({
          where: {
            id: ids.task
          }
        })
      ]).then(() => done()).catch(done)
    })

    afterEach((done) => {
      TaskType.destroy({
        where: {
          task_id: ids.task,
          type_id: ids.type
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          task_id: asymmetricMatcher(actual => actual === ids.task),
          type_id: asymmetricMatcher(actual => actual === ids.type)
        },
        deleted: null,
        multiplier: typeData.multiplier
      }
    })

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        task_id: asymmetricMatcher(actual => actual === ids.task),
        type_id: asymmetricMatcher(actual => actual === ids.type)
      },
      TaskType,
      {
        findBy: () => ({
          where: {
            task_id: ids.task,
            type_id: ids.type
          }
        })
      }
    )

    describe('when a task_type already exists between task and a type under the same header', () => {
      const otherTypeData = {
        eng_name: 'otye',
        fin_name: 'otyf',
        swe_name: 'otys',
        multiplier: 0.5,
        order: 2
      }

      beforeAll((done) => {
        Type.create({
          ...otherTypeData,
          type_header_id: ids.type_header
        }).then((type) => {
          ids.other_type = type.id
          done()
        }).catch(done)
      })

      beforeEach((done) => {
        TaskType.create({
          task_id: ids.task,
          type_id: ids.other_type
        }).then(() => done()).catch(done)
      })

      afterAll((done) => {
        Type.destroy({
          where: {
            id: ids.other_type
          }
        }).then(() => done()).catch(done)
      })

      testBody(options, {
        common: {
          message: expect.any(String),
          created: {
            task_id: asymmetricMatcher(actual => actual === ids.task),
            type_id: asymmetricMatcher(actual => actual === ids.type)
          },
          deleted: {
            task_id: asymmetricMatcher(actual => actual === ids.task),
            type_id: asymmetricMatcher(actual => actual === ids.other_type)
          },
          multiplier: typeData.multiplier
        }
      })

      testDatabaseDestroy(
        options,
        TaskType,
        {
          findBy: () => ({
            where: {
              task_id: ids.task,
              type_id: ids.other_type
            }
          })
        }
      )
    })

    describe('when taskObjectives have already been established', () => {
      const objectiveData = {
        eng_name: 'oe',
        fin_name: 'of',
        swe_name: 'os',
        course_instance_id: 1,
        category_id: 1,
        skill_level_id: 1,
        order: 100
      }
      const taskObjectiveData = {
        multiplier: 1
      }
      beforeAll((done) => {
        Promise.all([
          Objective.create(objectiveData),
          Objective.create(objectiveData)
        ]).then(([objective0, objective1]) => {
          ids.objective = [objective0.id, objective1.id]
          Promise.all([
            TaskObjective.create({
              ...taskObjectiveData,
              task_id: ids.task,
              objective_id: objective0.id,
              modified: true
            }),
            TaskObjective.create({
              ...taskObjectiveData,
              task_id: ids.task,
              objective_id: objective1.id,
              modified: false
            })
          ]).then(([taskObjective0, taskObjective1]) => {
            ids.taskObjective = [taskObjective0.id, taskObjective1.id]
            done()
          }).catch(done)
        }).catch(done)
      })

      afterEach((done) => {
        TaskObjective.update({
          multiplier: taskObjectiveData.multiplier
        }, {
          where: {
            id: {
              [Op.in]: ids.taskObjective
            }
          }
        }).then(() => done()).catch(done)
      })

      afterAll((done) => {
        Objective.destroy({
          where: {
            id: {
              [Op.in]: ids.objective
            }
          }
        }).then(() => done()).catch(done)
      })

      testBody(options, {
        common: {
          message: expect.any(String),
          created: {
            task_id: asymmetricMatcher(actual => actual === ids.task),
            type_id: asymmetricMatcher(actual => actual === ids.type)
          },
          deleted: null,
          multiplier: typeData.multiplier,
          taskObjectives: [{
            id: asymmetricMatcher(actual => actual === ids.objective[1]),
            multiplier: typeData.multiplier
          }]
        }
      })

      testDatabaseSave(
        options,
        {
          multiplier: taskObjectiveData.multiplier
        },
        TaskObjective,
        {
          findBy: () => ids.taskObjective[0],
          text: 'leaves modified multipliers untouched.'
        }
      )

      testDatabaseSave(
        options,
        {
          multiplier: typeData.multiplier
        },
        TaskObjective,
        {
          findBy: () => ids.taskObjective[1],
          text: 'updates unmodified multipliers to reflect new value.'
        }
      )
    })

    describe('responds with an error code when', () => {
      describe('task is not found', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble = {
            ...options.preamble,
            send: { ...data, task_id: 999999 }
          }
        })
        testStatusCode(derivativeOptions, 404)
      })

      describe('type is not found', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble = {
            ...options.preamble,
            send: { ...data, type_id: 999999 }
          }
        })
        testStatusCode(derivativeOptions, 404)
      })

      describe('task and type are from different course instances', () => {
        const derivativeOptions = { ...options }
        beforeAll((done) => {
          Task.create({
            ...taskData,
            course_instance_id: 2
          }).then((task) => {
            derivativeOptions.preamble = {
              ...options.preamble,
              send: { ...data, task_id: task.id }
            }
            ids.alien_task = task.id
            done()
          }).catch(done)
        })

        afterAll((done) => {
          Task.destroy({
            where: {
              id: ids.alien_task
            }
          }).then(() => done()).catch(done)
        })

        testStatusCode(derivativeOptions, 400)
      })
    })
  })

  describe('POST /types/detach', () => {
    const typeHeaderData = {
      eng_name: 'the',
      fin_name: 'thf',
      swe_name: 'ths',
      order: 100
    }
    const taskData = {
      eng_name: 'te',
      fin_name: 'tf',
      swe_name: 'ts',
      eng_description: 'tde',
      fin_description: 'tdf',
      swe_description: 'tds',
      max_points: 3,
      info: 'ti',
      order: 100
    }
    const typeData = {
      eng_name: 'tye',
      fin_name: 'tyf',
      swe_name: 'tys',
      multiplier: 0.4,
      order: 1
    }
    const data = {}

    const options = {
      method: 'post',
      route: '/api/tasks/types/detach',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    const ids = {}

    beforeAll((done) => {
      Promise.all([
        TypeHeader.create({
          ...typeHeaderData,
          course_instance_id: 1
        }),
        Task.create({
          ...taskData,
          course_instance_id: 1
        })
      ]).then(([typeHeader, task]) => {
        ids.type_header = typeHeader.id
        ids.task = task.id
        data.task_id = task.id
        Type.create({
          ...typeData,
          type_header_id: typeHeader.id
        }).then((type) => {
          ids.type = type.id
          data.type_id = type.id
          done()
        }).catch(done)
      }).catch(done)
    })

    beforeEach((done) => {
      TaskType.create({
        task_id: ids.task,
        type_id: ids.type
      }).then((taskType) => {
        ids.taskType = taskType.id
        done()
      }).catch(done)
    })

    afterEach((done) => {
      TaskType.destroy({
        where: {
          id: ids.taskType
        }
      }).then(() => done()).catch(done)
    })

    afterAll((done) => {
      Promise.all([
        TypeHeader.destroy({
          where: {
            id: ids.type_header
          }
        }),
        Task.destroy({
          where: {
            id: ids.task
          }
        })
      ]).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        multiplier: 1,
        deleted: {
          task_id: asymmetricMatcher(actual => actual === ids.task),
          type_id: asymmetricMatcher(actual => actual === ids.type)
        }
      }
    })

    describe('when taskObjectives have already been established', () => {
      const objectiveData = {
        eng_name: 'oe',
        fin_name: 'of',
        swe_name: 'os',
        course_instance_id: 1,
        category_id: 1,
        skill_level_id: 1,
        order: 100
      }
      const taskObjectiveData = {
        multiplier: typeData.multiplier
      }
      beforeAll((done) => {
        Promise.all([
          Objective.create(objectiveData),
          Objective.create(objectiveData)
        ]).then(([objective0, objective1]) => {
          ids.objective = [objective0.id, objective1.id]
          Promise.all([
            TaskObjective.create({
              ...taskObjectiveData,
              task_id: ids.task,
              objective_id: objective0.id,
              modified: true
            }),
            TaskObjective.create({
              ...taskObjectiveData,
              task_id: ids.task,
              objective_id: objective1.id,
              modified: false
            })
          ]).then(([taskObjective0, taskObjective1]) => {
            ids.taskObjective = [taskObjective0.id, taskObjective1.id]
            done()
          }).catch(done)
        }).catch(done)
      })

      afterEach((done) => {
        TaskObjective.update({
          multiplier: taskObjectiveData.multiplier
        }, {
          where: {
            id: {
              [Op.in]: ids.taskObjective
            }
          }
        }).then(() => done()).catch(done)
      })

      afterAll((done) => {
        Objective.destroy({
          where: {
            id: {
              [Op.in]: ids.objective
            }
          }
        }).then(() => done()).catch(done)
      })

      testBody(options, {
        common: {
          message: expect.any(String),
          deleted: {
            task_id: asymmetricMatcher(actual => actual === ids.task),
            type_id: asymmetricMatcher(actual => actual === ids.type)
          },
          multiplier: 1,
          taskObjectives: [{
            id: asymmetricMatcher(actual => actual === ids.objective[1]),
            multiplier: 1
          }]
        }
      })

      testDatabaseSave(
        options,
        {
          multiplier: taskObjectiveData.multiplier
        },
        TaskObjective,
        {
          findBy: () => ids.taskObjective[0],
          text: 'leaves modified multipliers untouched.'
        }
      )

      testDatabaseSave(
        options,
        {
          multiplier: 1
        },
        TaskObjective,
        {
          findBy: () => ids.taskObjective[1],
          text: 'updates unmodified multipliers to reflect new value.'
        }
      )
    })

    describe('responds with an error code when', () => {
      describe('task is not found', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble = {
            ...options.preamble,
            send: { ...data, task_id: 999999 }
          }
        })
        testStatusCode(derivativeOptions, 404)
      })

      describe('type is not found', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.preamble = {
            ...options.preamble,
            send: { ...data, type_id: 999999 }
          }
        })
        testStatusCode(derivativeOptions, 404)
      })

      describe('task_type is not found', () => {
        beforeEach((done) => {
          TaskType.destroy({
            where: {
              id: ids.taskType
            }
          }).then(() => done()).catch(done)
        })

        testStatusCode(options, 404)
      })
    })
  })
})
