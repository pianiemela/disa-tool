const { Op } = require('sequelize')
const {
  testGlobalTeacherPrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testStatusCode,
  testTeacherOnCoursePrivilege,
  asymmetricMatcher,
  unorderedListMatcher
} = require('../testUtils')
const {
  Course,
  CourseInstance,
  CoursePerson,
  Task,
  TaskResponse,
  TypeHeader,
  Type,
  SelfAssessment,
  AssessmentResponse,
  TaskType,
  Person
} = require('../../database/models.js')

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
        set: ['uid', 'mikkoti']
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
        set: ['uid', 'mikkoti']
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
          person_id: 410
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

  describe('GET /instance/:courseId', () => {
    const courseInstanceData = {
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn',
      active: true,
      course_id: 1
    }
    const coursePersonData = {
      person_id: 370,
      role: 'STUDENT'
    }
    const teacherData = {
      person_id: 410,
      role: 'TEACHER'
    }
    const taskData = {
      eng_name: 'te',
      fin_name: 'tf',
      swe_name: 'ts',
      eng_description: 'ed',
      fin_description: 'fd',
      swe_description: 'sd',
      info: 'test info',
      max_points: 3,
      order: 1
    }
    const typeHeaderData = {
      eng_name: 'the',
      fin_name: 'thf',
      swe_name: 'ths',
      order: 1
    }
    const selfAssessmentData = {
      eng_name: 'sae',
      fin_name: 'saf',
      swe_name: 'san',
      eng_instructions: 'ei',
      fin_instructions: 'fi',
      swe_instructions: 'si',
      active: true,
      open: true,
      show_feedback: false,
      structure: {}
    }
    const taskResponseData = {
      person_id: 370,
      points: 3
    }
    const typeData = {
      eng_name: 'tye',
      fin_name: 'tyf',
      swe_name: 'tys',
      multiplier: 0.7,
      order: 1
    }
    const assesmentResponseData = {
      person_id: 370,
      response: {}
    }
    const options = {
      method: 'get',
      preamble: {
        set: ['uid', 'jemisa']
      }
    }

    const ids = {}

    beforeAll((done) => {
      CourseInstance.create(courseInstanceData).then((courseInstance) => {
        options.route = `/api/courses/instance/${courseInstance.id}`
        ids.courseInstance = courseInstance.id
        Promise.all([
          CoursePerson.create({
            ...coursePersonData,
            course_instance_id: courseInstance.id
          }),
          CoursePerson.create({
            ...teacherData,
            course_instance_id: courseInstance.id
          }),
          Task.create({
            ...taskData,
            course_instance_id: courseInstance.id
          }),
          TypeHeader.create({
            ...typeHeaderData,
            course_instance_id: courseInstance.id
          }),
          SelfAssessment.create({
            ...selfAssessmentData,
            course_instance_id: courseInstance.id
          })
        ]).then(([coursePerson, teacher, task, typeHeader, selfAssessment]) => {
          ids.coursePerson = coursePerson.id
          ids.teacher = teacher.id
          ids.task = task.id
          ids.typeHeader = typeHeader.id
          ids.selfAssessment = selfAssessment.id
          Promise.all([
            TaskResponse.create({
              ...taskResponseData,
              task_id: task.id
            }),
            Type.create({
              ...typeData,
              type_header_id: typeHeader.id
            }),
            AssessmentResponse.create({
              ...assesmentResponseData,
              self_assessment_id: selfAssessment.id
            })
          ]).then(([taskResponse, type, assesmentResponse]) => {
            ids.taskResponse = taskResponse.id
            ids.type = type.id
            ids.assesmentResponse = assesmentResponse.id
            TaskType.create({
              task_id: task.id,
              type_id: type.id
            }).then((taskType) => {
              ids.taskType = taskType.id
              done()
            }).catch(done)
          }).catch(done)
        }).catch(done)
      }).catch(done)
    })

    afterAll((done) => {
      CourseInstance.destroy({
        where: {
          id: ids.courseInstance
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testBody(options, {
      common: {
        id: asymmetricMatcher(actual => actual === ids.courseInstance),
        course_id: courseInstanceData.course_id,
        active: courseInstanceData.active,
        courseRole: 'STUDENT',
        tasks: [{
          id: asymmetricMatcher(actual => actual === ids.task),
          course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance),
          max_points: taskData.max_points,
          task_responses: [{
            id: asymmetricMatcher(actual => actual === ids.taskResponse),
            person_id: taskResponseData.person_id,
            task_id: asymmetricMatcher(actual => actual === ids.task)
          }],
          types: [{
            id: asymmetricMatcher(actual => actual === ids.type),
            order: typeData.order,
            type_header: {
              id: asymmetricMatcher(actual => actual === ids.typeHeader),
              order: typeHeaderData.order
            }
          }]
        }],
        self_assessments: [{
          id: asymmetricMatcher(actual => actual === ids.selfAssessment),
          structure: selfAssessmentData.structure,
          open: selfAssessmentData.open,
          active: selfAssessmentData.active,
          show_feedback: selfAssessmentData.show_feedback,
          course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance),
          assessment_responses: [{
            ...assesmentResponseData,
            id: asymmetricMatcher(actual => actual === ids.assesmentResponse),
            self_assessment_id: asymmetricMatcher(actual => actual === ids.selfAssessment)
          }]
        }],
        people: [{
          id: 410
        }],
        type_headers: [{
          id: asymmetricMatcher(actual => actual === ids.typeHeader),
          types: [{
            id: asymmetricMatcher(actual => actual === ids.type),
            order: typeData.order
          }]
        }]
      },
      eng: {
        name: courseInstanceData.eng_name
      },
      fin: {
        name: courseInstanceData.fin_name
      },
      swe: {
        name: courseInstanceData.swe_name
      }
    })

    describe('responds with error code when', () => {
      describe('specified course instance does not exist', () => {
        const derivativeOptions = { ...options }
        beforeAll(() => {
          derivativeOptions.route = '/api/courses/instance/999999'
        })

        testStatusCode(derivativeOptions, 404)
      })

      describe('user is not registered', () => {
        beforeAll((done) => {
          CoursePerson.destroy({
            where: {
              id: ids.coursePerson
            }
          }).then(() => done()).catch(done)
        })

        afterAll((done) => {
          CoursePerson.create({
            ...coursePersonData,
            course_instance_id: ids.courseInstance
          }).then((coursePerson) => {
            ids.coursePerson = coursePerson.id
            done()
          }).catch(done)
        })

        testStatusCode(options, 403)
      })
    })
  })

  describe('GET /user', () => {
    const courseInstanceData = [
      {
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        active: true,
        course_id: 1
      },
      {
        eng_name: 'en1',
        fin_name: 'fn1',
        swe_name: 'sn1',
        active: false,
        course_id: 1
      }
    ]
    const personData = {
      username: 'plizkillme',
      name: 'pn',
      studentnumber: '011111111',
      role: 'STUDENT',
      university: 'helsinki.fi'
    }
    const coursePersonData = {
      role: 'STUDENT'
    }
    const options = {
      method: 'get',
      route: '/api/courses/user',
      preamble: {}
    }

    const ids = {}

    beforeAll((done) => {
      Promise.all([
        Person.create(personData),
        ...courseInstanceData.map(data => CourseInstance.create(data))
      ]).then(([person, ...courseInstances]) => {
        options.preamble.set = ['uid', 'plizkillme']
        ids.person = person.id
        ids.courseInstance = courseInstances.map(courseInstance => courseInstance.id)
        Promise.all((
          courseInstances.map(courseInstance => CoursePerson.create({
            ...coursePersonData,
            course_instance_id: courseInstance.id,
            person_id: person.id
          }))
        )).then((coursePersons) => {
          ids.coursePerson = coursePersons.map(coursePerson => coursePerson.id)
          done()
        }).catch(done)
      }).catch(done)
    })

    afterAll((done) => {
      CourseInstance.destroy({
        where: {
          id: {
            [Op.in]: ids.courseInstance
          }
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testBody(options, {
      common: unorderedListMatcher([
        {
          id: asymmetricMatcher(actual => actual === ids.courseInstance[0]),
          course_id: courseInstanceData[0].course_id,
          active: courseInstanceData[0].active,
          people: [{
            ...personData,
            id: asymmetricMatcher(actual => actual === ids.person)
          }]
        },
        {
          id: asymmetricMatcher(actual => actual === ids.courseInstance[1]),
          course_id: courseInstanceData[1].course_id,
          active: courseInstanceData[1].active,
          people: [{
            ...personData,
            id: asymmetricMatcher(actual => actual === ids.person)
          }]
        }
      ]),
      eng: unorderedListMatcher([
        { name: courseInstanceData[0].eng_name },
        { name: courseInstanceData[1].eng_name }
      ]),
      fin: unorderedListMatcher([
        { name: courseInstanceData[0].fin_name },
        { name: courseInstanceData[1].fin_name }
      ]),
      swe: unorderedListMatcher([
        { name: courseInstanceData[0].swe_name },
        { name: courseInstanceData[1].swe_name }
      ])
    }, {
      do_not_spread: true
    })
  })

  describe('GET /:courseId', () => {
    const courseData = {
      eng_name: 'ee',
      fin_name: 'ff',
      swe_name: 'ss'
    }
    const courseInstanceData = [
      {
        eng_name: 'ciee',
        fin_name: 'ciff',
        swe_name: 'ciss',
        active: false
      },
      {
        eng_name: 'ci2ee',
        fin_name: 'ci2ff',
        swe_name: 'ci2ss',
        active: true
      }
    ]
    const options = {
      method: 'get',
      preamble: {
        set: ['uid', 'jemisa']
      }
    }

    const ids = {}

    beforeAll((done) => {
      Course.create(courseData).then((course) => {
        ids.course = course.id
        options.route = `/api/courses/${course.id}`
        CourseInstance.create({
          ...courseInstanceData[0],
          course_id: course.id
        }).then((courseInstance0) => {
          const courseInstances = [courseInstance0]
          CourseInstance.create({
            ...courseInstanceData[1],
            course_id: course.id
          }).then((courseInstance1) => {
            courseInstances.push(courseInstance1)
            ids.courseInstances = courseInstances.map(courseInstance => courseInstance.id)
            CoursePerson.create({
              person_id: 370,
              course_instance_id: courseInstances[0].id,
              role: 'STUDENT'
            }).then(() => done()).catch(done)
          })
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
      common: unorderedListMatcher([
        {
          id: asymmetricMatcher(actual => actual === ids.courseInstances[0]),
          course_id: asymmetricMatcher(actual => actual === ids.course),
          active: courseInstanceData[0].active,
          registered: 'STUDENT'
        },
        {
          id: asymmetricMatcher(actual => actual === ids.courseInstances[1]),
          course_id: asymmetricMatcher(actual => actual === ids.course),
          active: courseInstanceData[1].active,
          registered: null
        }
      ]),
      eng: unorderedListMatcher([
        { name: courseInstanceData[0].eng_name },
        { name: courseInstanceData[1].eng_name }
      ]),
      fin: unorderedListMatcher([
        { name: courseInstanceData[0].fin_name },
        { name: courseInstanceData[1].fin_name }
      ]),
      swe: unorderedListMatcher([
        { name: courseInstanceData[0].swe_name },
        { name: courseInstanceData[1].swe_name }
      ])
    }, {
      do_not_spread: true
    })
  })
})
