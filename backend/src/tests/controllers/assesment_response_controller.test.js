const { Op } = require('sequelize')
const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const {
  SelfAssessment,
  AssessmentResponse,
  CourseInstance,
  Grade,
  CoursePerson,
  SkillLevel,
  Person,
  Category,
  Objective,
  TaskObjective,
  Task,
  TaskResponse,
  CategoryGrade
} = require('../../database/models.js')
const { SECRET } = require('../../../conf-backend')

const courseInstanceData = {
  course_id: 1,
  eng_name: 'en',
  fin_name: 'fn',
  swe_name: 'sn',
  active: false
}
const selfAssesmentData = {
  eng_name: 'sae',
  fin_name: 'saf',
  swe_name: 'sas',
  eng_instructions: 'saei',
  fin_instructions: 'safi',
  swe_instructions: 'sasi',
  open: false,
  active: false,
  show_feedback: false,
  structure: {}
}
const skillLevelData = {
  eng_name: 'le',
  fin_name: 'lf',
  swe_name: 'ls',
  order: 1
}
const categoryData = {
  eng_name: 'le',
  fin_name: 'lf',
  swe_name: 'ls',
  order: 1
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
const taskResponseData = {
  points: 2
}
const objectiveData = {
  eng_name: 'oe',
  fin_name: 'of',
  swe_name: 'os',
  order: 1
}
const taskObjectiveData = {
  multiplier: 1,
  modified: false
}
const gradeData = [
  {
    eng_name: 'ge_0',
    fin_name: 'gf_0',
    swe_name: 'gs_0',
    needed_for_grade: 0.2,
    prerequisite: null,
    order: 1
  },
  {
    eng_name: 'ge_1',
    fin_name: 'gf_1',
    swe_name: 'gs_1',
    needed_for_grade: 0.4,
    prerequisite: null,
    order: 2
  },
  {
    eng_name: 'ge_2',
    fin_name: 'gf_2',
    swe_name: 'gs_2',
    needed_for_grade: 0.6,
    prerequisite: null,
    order: 3
  }
]

describe('assesment response controller', () => {
  const finalGradeResponseHeaders = {
    eng_name: 'fgre',
    fin_name: 'fgrf',
    swe_name: 'fgrs'
  }
  const ids = {
    whitelist: []
  }
  beforeAll((done) => {
    CourseInstance.create(courseInstanceData).then((courseInstance) => {
      ids.courseInstance = courseInstance.id
      Promise.all([
        SelfAssessment.create({
          ...selfAssesmentData,
          course_instance_id: courseInstance.id
        }),
        SkillLevel.create({
          ...skillLevelData,
          course_instance_id: courseInstance.id
        }),
        Category.create({
          ...categoryData,
          course_instance_id: courseInstance.id
        }),
        Task.create({
          ...taskData,
          course_instance_id: courseInstance.id
        }),
        CoursePerson.create({
          course_instance_id: courseInstance.id,
          person_id: 421,
          role: 'STUDENT'
        }),
        CoursePerson.create({
          course_instance_id: courseInstance.id,
          person_id: 424,
          role: 'TEACHER'
        })
      ]).then(([selfAssesment, skillLevel, category, task]) => {
        ids.selfAssesment = selfAssesment.id
        ids.category = category.id
        ids.task = task.id
        Promise.all([
          Objective.create({
            ...objectiveData,
            course_instance_id: courseInstance.id,
            category_id: category.id,
            skill_level_id: skillLevel.id
          }),
          TaskResponse.create({
            taskResponseData,
            person_id: 421,
            task_id: task.id
          }),
          ...gradeData.map(data => Grade.create({
            ...data,
            skill_level_id: skillLevel.id,
            course_instance_id: courseInstance.id
          }))
        ]).then(([objective, taskResponse, ...grades]) => {
          ids.objective = objective.id
          ids.taskResponse = taskResponse.id
          ids.grades = grades.map(grade => grade.id)
          grades.forEach((grade, index) => {
            if (index === 0) return
            // eslint-disable-next-line no-param-reassign
            grade.prerequisite = grades[index - 1].id
          })
          Promise.all([
            AssessmentResponse.create({
              response: {
                course_instance_id: courseInstance.id,
                assessmentType: 'category',
                finalGradeResponse: {
                  grade: grades[0].id,
                  grade_name: grades[0].eng_name,
                  headers: finalGradeResponseHeaders
                },
                questionModuleResponses: [
                  {
                    id: category.id,
                    name: category.fin_name,
                    grade: grades[1].id,
                    grade_name: grades[1].fin_name,
                    responseText: 'Some text.',
                    textFieldOn: true
                  }
                ]
              },
              person_id: 421,
              self_assessment_id: selfAssesment.id
            }),
            TaskObjective.create({
              ...taskObjectiveData,
              objective_id: objective.id,
              task_id: task.id
            }),
            ...grades.map(grade => grade.save()),
            ...grades.map(grade => CategoryGrade.create({
              category_id: category.id,
              grade_id: grade.id,
              needed_for_grade: grade.needed_for_grade
            }))
          ]).then(([assesmentResponse]) => {
            ids.assesmentResponse = assesmentResponse.id
            ids.whitelist.push(assesmentResponse.id)
            done()
          }).catch(done)
        }).catch(done)
      }).catch(done)
    }).catch(done)
  })

  afterAll((done) => {
    CourseInstance.destroy({
      where: { id: ids.courseInstance }
    }).then(() => done())
  })

  describe('GET /:selfassesmentId', () => {
    const options = {
      method: 'get',
      route: '/api/assesmentresponse',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.student}`]
      }
    }

    beforeAll(() => {
      options.route = `${options.route}/${ids.selfAssesment}`
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testBody(options, {
      common: {
        data: {
          id: asymmetricMatcher(actual => actual === ids.assesmentResponse),
          person_id: 421,
          self_assessment_id: asymmetricMatcher(actual => actual === ids.selfAssesment),
          response: {
            finalGradeResponse: {
              grade: asymmetricMatcher(actual => actual === ids.grades[0]),
              grade_name: gradeData[0].eng_name,
              headers: finalGradeResponseHeaders
            },
            questionModuleResponses: expect.arrayContaining([
              {
                id: asymmetricMatcher(actual => actual === ids.category),
                name: categoryData.fin_name,
                grade: asymmetricMatcher(actual => actual === ids.grades[1]),
                grade_name: gradeData[1].fin_name,
                responseText: 'Some text.',
                textFieldOn: true
              }
            ])
          }
        }
      },
      eng: {
        data: {
          response: {
            finalGradeResponse: {
              name: finalGradeResponseHeaders.eng_name
            }
          }
        }
      },
      fin: {
        data: {
          response: {
            finalGradeResponse: {
              name: finalGradeResponseHeaders.fin_name
            }
          }
        }
      },
      swe: {
        data: {
          response: {
            finalGradeResponse: {
              name: finalGradeResponseHeaders.swe_name
            }
          }
        }
      }
    })
  })

  describe('POST /', () => {
    const personData = {
      name: 'pn',
      studentnumber: '011111111',
      role: 'STUDENT',
      university: 'helsinki.fi'
    }
    const data = {
      assessmentType: 'category',
      finalGradeResponse: {},
      finalHeaders: [
        { type: 'eng_name', value: 'eee' },
        { type: 'eng_name', value: 'fff' },
        { type: 'eng_name', value: 'sss' }
      ]
    }
    const options = {
      method: 'post',
      route: '/api/assesmentresponse/',
      preamble: {
        send: data
      }
    }

    beforeAll((done) => {
      data.course_instance_id = ids.courseInstance
      data.finalGradeResponse.grade = ids.grades[0]
      data.finalGradeResponse.grade_name = gradeData[0].eng_name
      data.assessmentId = ids.selfAssesment
      Person.create(personData).then((person) => {
        ids.createPerson = person.id
        const token = jwt.sign({ user: { id: person.id } }, SECRET)
        options.preamble.set = ['Authorization', `Bearer ${token}`]
        CoursePerson.create({
          role: 'STUDENT',
          course_instance_id: ids.courseInstance,
          person_id: person.id
        }).then(() => done()).catch(done)
      }).catch(done)
    })

    afterEach((done) => {
      AssessmentResponse.destroy({
        where: {
          self_assessment_id: ids.selfAssesment,
          id: {
            [Op.notIn]: ids.whitelist
          }
        }
      }).then(() => done())
    })

    afterAll((done) => {
      Person.destroy({
        where: { id: ids.createPerson }
      }).then(() => done())
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({
      ...options,
      preamble: {
        ...options.preamble,
        set: ['Authorization', `Bearer ${jwt.sign({ user: { id: 100 } }, process.env.SECRET)}`]
      }
    }, 403)

    const dataToResponse = (input) => {
      const output = { ...input }
      delete output.finalHeaders
      return output
    }

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          id: expect.any(Number),
          self_assessment_id: asymmetricMatcher(actual => actual === ids.selfAssesment),
          person_id: asymmetricMatcher(actual => actual === ids.createPerson),
          response: {
            ...dataToResponse(data),
            finalGradeResponse: {
              grade: asymmetricMatcher(actual => actual === ids.grades[0]),
              grade_name: asymmetricMatcher(actual => actual === gradeData[0].eng_name)
            },
            course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance)
          }
        }
      }
    })

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        self_assessment_id: asymmetricMatcher(actual => actual === ids.selfAssesment),
        person_id: asymmetricMatcher(actual => actual === ids.createPerson),
        response: {
          ...dataToResponse(data),
          finalGradeResponse: {
            grade: asymmetricMatcher(actual => actual === ids.grades[0]),
            grade_name: asymmetricMatcher(actual => actual === gradeData[0].eng_name)
          },
          course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance)
        }
      },
      AssessmentResponse,
      {
        pathToId: ['body', 'data', 'id']
      }
    )

    describe('when response already exists', () => {
      beforeEach((done) => {
        AssessmentResponse.create({
          response: {},
          self_assessment_id: ids.selfAssesment,
          person_id: ids.createPerson
        }).then((assesmentResponse) => {
          ids.existingAssesmentResponse = assesmentResponse.id
          done()
        }).catch(done)
      })

      testBody(options, {
        common: {
          message: expect.any(String),
          data: {
            id: asymmetricMatcher(actual => actual === ids.existingAssesmentResponse),
            self_assessment_id: asymmetricMatcher(actual => actual === ids.selfAssesment),
            person_id: asymmetricMatcher(actual => actual === ids.createPerson),
            response: {
              ...dataToResponse(data),
              finalGradeResponse: {
                grade: asymmetricMatcher(actual => actual === ids.grades[0]),
                grade_name: asymmetricMatcher(actual => actual === gradeData[0].eng_name)
              },
              course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance)
            }
          }
        }
      })

      testDatabaseSave(
        options,
        {
          id: asymmetricMatcher(actual => actual === ids.existingAssesmentResponse),
          self_assessment_id: asymmetricMatcher(actual => actual === ids.selfAssesment),
          person_id: asymmetricMatcher(actual => actual === ids.createPerson),
          response: {
            ...dataToResponse(data),
            finalGradeResponse: {
              grade: asymmetricMatcher(actual => actual === ids.grades[0]),
              grade_name: asymmetricMatcher(actual => actual === gradeData[0].eng_name)
            },
            course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance)
          }
        },
        AssessmentResponse,
        {
          pathToId: ['body', 'data', 'id']
        }
      )
    })

    describe('when assesmentType is set to "objectives"', () => {
      const objectiveOptions = { ...options }

      beforeAll(() => {
        objectiveOptions.preamble.send.assessmentType = 'objectives'
      })

      testHeaders(objectiveOptions)

      testStatusCode(objectiveOptions, 200)

      testBody(options, {
        common: {
          message: expect.any(String),
          data: {
            id: expect.any(Number),
            self_assessment_id: asymmetricMatcher(actual => actual === ids.selfAssesment),
            person_id: asymmetricMatcher(actual => actual === ids.createPerson),
            response: {
              ...dataToResponse(data),
              assessmentType: 'objectives',
              finalGradeResponse: {
                grade: asymmetricMatcher(actual => actual === ids.grades[0]),
                grade_name: asymmetricMatcher(actual => actual === gradeData[0].eng_name)
              },
              course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance)
            }
          }
        }
      })
    })
  })

  describe('PUT /generate-feedbacks/:id', () => {
    const options = {
      method: 'put',
      route: '/api/assesmentresponse/generate-feedbacks',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    beforeAll(() => {
      options.route = `${options.route}/${ids.assesmentResponse}`
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/assesmentresponse/generate-feedbacks/999999' }, 404)
  })
})
