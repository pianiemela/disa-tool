const jwt = require('jsonwebtoken')
const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode,
  unorderedListMatcher
} = require('../testUtils')
const {
  SelfAssessment,
  CourseInstance,
  CoursePerson,
  Person
} = require('../../database/models.js')
const { SECRET } = require('../../../conf-backend')

describe('self_assesment_controller', () => {
  describe('POST /create', () => {
    const data = {
      active: false,
      course_instance_id: 1,
      structure: {
        formInfo: [
          {
            type: 'fin_name',
            value: 'fn'
          },
          {
            type: 'fin_instructions',
            value: 'fi'
          },
          {
            type: 'eng_name',
            value: 'en'
          },
          {
            type: 'eng_instructions',
            value: 'ei'
          },
          {
            type: 'swe_name',
            value: 'sn'
          },
          {
            type: 'swe_instructions',
            value: 'si'
          }
        ]
      },
      open: false,
      show_feedback: false
    }

    const options = {
      method: 'post',
      route: '/api/selfassesment/create',
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
        data: {
          id: expect.any(Number),
          structure: data.structure,
          open: data.open,
          active: data.active,
          show_feedback: data.show_feedback,
          course_instance_id: data.course_instance_id
        }
      },
      eng: {
        data: {
          name: data.structure.formInfo.find(info => info.type === 'eng_name').value,
          instructions: data.structure.formInfo.find(info => info.type === 'eng_instructions').value
        }
      },
      fin: {
        data: {
          name: data.structure.formInfo.find(info => info.type === 'fin_name').value,
          instructions: data.structure.formInfo.find(info => info.type === 'fin_instructions').value
        }
      },
      swe: {
        data: {
          name: data.structure.formInfo.find(info => info.type === 'swe_name').value,
          instructions: data.structure.formInfo.find(info => info.type === 'swe_instructions').value
        }
      }
    })

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        ...data,
        eng_name: data.structure.formInfo.find(info => info.type === 'eng_name').value,
        eng_instructions: data.structure.formInfo.find(info => info.type === 'eng_instructions').value,
        fin_name: data.structure.formInfo.find(info => info.type === 'fin_name').value,
        fin_instructions: data.structure.formInfo.find(info => info.type === 'fin_instructions').value,
        swe_name: data.structure.formInfo.find(info => info.type === 'swe_name').value,
        swe_instructions: data.structure.formInfo.find(info => info.type === 'swe_instructions').value
      },
      SelfAssessment,
      {
        disallowId: true,
        pathToId: ['body', 'data', 'id']
      }
    )
  })

  describe('GET /:id', () => {
    const data = {
      course_instance_id: 1,
      eng_name: 'e',
      fin_name: 'f',
      swe_name: 's',
      eng_instructions: 'ei',
      fin_instructions: 'fi',
      swe_instructions: 'si',
      open: false,
      active: false,
      show_feedback: false,
      structure: {
        displayCoursename: 'Tester 3',
        formInfo: [
          {
            id: 1,
            prefix: 'Fin',
            value: 'f',
            type: 'fin_name'
          },
          {
            id: 2,
            prefix: 'Eng',
            value: 'e',
            type: 'eng_name'
          },
          {
            id: 3,
            prefix: 'Swe',
            value: 's',
            type: 'swe_name'
          },
          {
            id: 4,
            prefix: 'Fin',
            header: 'fh',
            value: 'fi',
            type: 'fin_instructions'
          },
          {
            id: 5,
            prefix: 'Eng',
            header: 'eh',
            value: 'ei',
            type: 'eng_instructions'
          },
          {
            id: 6,
            prefix: 'Swe',
            header: 'sh',
            value: 'si',
            type: 'swe_instructions'
          }
        ],
        openQuestions: {
          questions: [],
          incrementId: 56,
          name: 'Open questions'
        },
        finalGrade: {
          headers: [
            {
              id: 1,
              prefix: 'Fin:',
              value: 'Anna itsellesi loppuarvosana kurssista',
              type: 'fin_name'
            },
            {
              id: 2,
              prefix: 'Eng:',
              value: 'Give yourself a final grade for the course',
              type: 'eng_name'
            },
            {
              id: 3,
              prefix: 'Swe:',
              value: 'Ge dig själv ett slutvitsord för kursen',
              type: 'swe_name'
            }
          ],
          textFieldOn: true,
          includedInAssesment: true,
          id: 55,
          header: 'Final grade',
          name: 'Give yourself a final grade for the course'
        },
        headers: {
          questionHeaders: [
            {
              id: 1,
              prefix: 'Fin:',
              value: 'Kysymykset',
              type: 'fin_name'
            },
            {
              id: 2,
              prefix: 'Eng:',
              value: 'Questions',
              type: 'eng_name'
            },
            {
              id: 3,
              prefix: 'Swe:',
              value: 'Frågor',
              type: 'swe_name'
            }
          ],
          openQ: [
            {
              id: 3,
              prefix: 'Fin:',
              value: 'Avoimet kysymykset',
              type: 'fin_name'
            },
            {
              id: 4,
              prefix: 'Eng:',
              value: 'Open questions',
              type: 'eng_name'
            },
            {
              id: 5,
              prefix: 'Swe:',
              value: 'Öppna frågor',
              type: 'swe_name'
            }
          ],
          grade: [
            {
              id: 6,
              prefix: 'Fin:',
              value: 'Loppuarvio',
              type: 'fin_name'
            },
            {
              id: 7,
              prefix: 'Eng:',
              value: 'Final grade',
              type: 'eng_name'
            },
            {
              id: 8,
              prefix: 'Swe:',
              value: 'Slutvitsord',
              type: 'swe_name'
            }
          ]
        },
        type: 'category',
        questionModules: [
          {
            id: 46,
            name: 'Yhtälöryhmät',
            textFieldOn: true,
            includedInAssesment: true
          },
          {
            id: 47,
            name: 'Vektoriavaruudet',
            textFieldOn: false,
            includedInAssesment: true
          },
          {
            id: 48,
            name: 'Virittäminen ja vapaus',
            textFieldOn: true,
            includedInAssesment: true
          },
          {
            id: 49,
            name: 'Matriisit',
            textFieldOn: true,
            includedInAssesment: false
          }
        ],
        questionModuleName: 'Questions'
      }
    }

    const options = {
      method: 'get',
      preamble: {}
    }

    const ids = {}

    beforeAll((done) => {
      SelfAssessment.create(data).then((result) => {
        ids.self_assesment = result.get({ plain: true }).id
        options.route = `/api/selfassesment/${ids.self_assesment}`
        done()
      })
    })

    testHeaders(options)

    testStatusCode({ ...options, route: '/api/selfassesment/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          ...data,
          id: asymmetricMatcher(actual => actual === ids.self_assesment),
          structure: expect.any(Object)
        }
      },
      eng: {
        data: {
          name: data.eng_name,
          instructions: {
            header: 'eh',
            value: data.eng_instructions
          }
        }
      },
      fin: {
        data: {
          name: data.fin_name,
          instructions: {
            header: 'fh',
            value: data.fin_instructions
          }
        }
      },
      swe: {
        data: {
          name: data.swe_name,
          instructions: {
            header: 'sh',
            value: data.swe_instructions
          }
        }
      }
    })
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
      SelfAssessment.create({
        course_instance_id: 1,
        eng_name: 'e',
        fin_name: 'f',
        swe_name: 's',
        eng_instructions: 'ei',
        fin_instructions: 'fi',
        swe_instructions: 'si',
        open: false,
        active: false,
        show_feedback: false,
        structure: {}
      }).then((result) => {
        ids.self_assesment = result.get({ plain: true }).id
        options.route = `/api/selfassesment/${ids.self_assesment}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testStatusCode({ ...options, route: '/api/selfassesment/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.self_assesment)
        }
      }
    })

    testDatabaseDestroy(options, SelfAssessment, { delay: 2000 })
  })

  describe('GET /', () => {
    const courseInstanceData = {
      course_id: 1,
      eng_name: 'cie',
      fin_name: 'cif',
      swe_name: 'cis',
      active: true
    }
    const selfAssesmentData = [
      {
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
      },
      {
        eng_name: 'sa2e',
        fin_name: 'sa2f',
        swe_name: 'sa2s',
        eng_instructions: 'sa2ei',
        fin_instructions: 'sa2fi',
        swe_instructions: 'sa2si',
        open: true,
        active: true,
        show_feedback: false,
        structure: {}
      },
      {
        eng_name: 'sa3e',
        fin_name: 'sa3f',
        swe_name: 'sa3s',
        eng_instructions: 'sa3ei',
        fin_instructions: 'sa3fi',
        swe_instructions: 'sa3si',
        open: true,
        active: true,
        show_feedback: false,
        structure: {}
      }
    ]
    const personData = {
      name: 'na',
      studentnumber: '00',
      university: 'helsinki.fi',
      role: 'STUDENT'
    }
    const options = {
      method: 'get',
      route: '/api/selfassesment/',
      preamble: {}
    }

    const ids = {}
    const matcher = {}

    beforeAll((done) => {
      Promise.all([
        Person.create(personData),
        CourseInstance.create(courseInstanceData),
        CourseInstance.create(courseInstanceData)
      ]).then(([person, ...courseInstances]) => {
        ids.person = person.id
        options.preamble.set = ['Authorization', `Bearer ${jwt.sign({ user: { id: person.id } }, SECRET)}`]
        ids.courseInstances = courseInstances.map(courseInstance => courseInstance.id)
        Promise.all([
          ...courseInstances.map(courseInstance => CoursePerson.create({
            person_id: person.id,
            course_instance_id: courseInstance.id,
            role: 'STUDENT'
          })),
          ...selfAssesmentData.map((dataRow, index) => SelfAssessment.create({
            ...dataRow,
            course_instance_id: courseInstances[(index % 2)].id
          }))
        ]).then(([,, ...selfAssesments]) => {
          ids.selfAssesments = selfAssesments.map(selfAssesment => selfAssesment.id)
          const activeSelfAssesments = selfAssesments.filter(selfAssesment => selfAssesment.active)
          matcher.common = {
            data: unorderedListMatcher(activeSelfAssesments.map(selfAssesment => ({
              id: selfAssesment.id,
              structure: selfAssesment.structure,
              open: selfAssesment.open,
              active: selfAssesment.active,
              show_feedback: selfAssesment.show_feedback,
              course_instance_id: selfAssesment.course_instance_id
            })))
          }
          matcher.eng = {
            data: unorderedListMatcher(activeSelfAssesments.map(selfAssesment => ({
              name: selfAssesment.eng_name,
              instructions: selfAssesment.eng_instructions
            })))
          }
          matcher.fin = {
            data: unorderedListMatcher(activeSelfAssesments.map(selfAssesment => ({
              name: selfAssesment.fin_name,
              instructions: selfAssesment.fin_instructions
            })))
          }
          matcher.swe = {
            data: unorderedListMatcher(activeSelfAssesments.map(selfAssesment => ({
              name: selfAssesment.swe_name,
              instructions: selfAssesment.swe_instructions
            })))
          }
          done()
        }).catch(done)
      }).catch(done)
    })

    afterAll((done) => {
      Promise.all([
        CourseInstance.destroy({
          where: {
            id: ids.courseInstance
          }
        }),
        Person.destroy({
          where: {
            id: ids.person
          }
        })
      ]).then(() => done()).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testBody(options, matcher)
  })

  describe('PUT /update/:id', () => {
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
      structure: {},
      course_instance_id: 1
    }
    const data = {
      active: true,
      course_instance_id: selfAssesmentData.course_instance_id,
      structure: {
        formInfo: [
          {
            type: 'fin_name',
            value: 'fn'
          },
          {
            type: 'fin_instructions',
            value: 'fi'
          },
          {
            type: 'eng_name',
            value: 'en'
          },
          {
            type: 'eng_instructions',
            value: 'ei'
          },
          {
            type: 'swe_name',
            value: 'sn'
          },
          {
            type: 'swe_instructions',
            value: 'si'
          }
        ]
      },
      open: true,
      show_feedback: true
    }
    const options = {
      method: 'put',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.teacher}`],
        send: data
      }
    }
    const ids = {}

    beforeAll((done) => {
      SelfAssessment.create(selfAssesmentData).then((selfAssesment) => {
        ids.selfAssesment = selfAssesment.id
        data.id = selfAssesment.id
        options.route = `/api/selfassesment/update/${selfAssesment.id}`
        done()
      }).catch(done)
    })

    afterEach((done) => {
      SelfAssessment.update(selfAssesmentData, {
        where: {
          id: ids.selfAssesment
        }
      }).then(() => done()).catch(done)
    })

    afterAll((done) => {
      SelfAssessment.destroy({
        where: {
          id: ids.selfAssesment
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          id: asymmetricMatcher(actual => actual === ids.selfAssesment),
          structure: data.structure,
          open: data.open,
          active: data.active,
          show_feedback: data.show_feedback,
          course_instance_id: selfAssesmentData.course_instance_id
        }
      },
      eng: {
        data: {
          name: data.structure.formInfo.find(element => element.type === 'eng_name').value,
          instructions: data.structure.formInfo.find(element => element.type === 'eng_instructions').value
        }
      },
      fin: {
        data: {
          name: data.structure.formInfo.find(element => element.type === 'fin_name').value,
          instructions: data.structure.formInfo.find(element => element.type === 'fin_instructions').value
        }
      },
      swe: {
        data: {
          name: data.structure.formInfo.find(element => element.type === 'swe_name').value,
          instructions: data.structure.formInfo.find(element => element.type === 'swe_instructions').value
        }
      }
    })

    testDatabaseSave(
      options,
      {
        ...data,
        id: asymmetricMatcher(actual => actual === ids.selfAssesment),
        eng_name: data.structure.formInfo.find(element => element.type === 'eng_name').value,
        eng_instructions: data.structure.formInfo.find(element => element.type === 'eng_instructions').value,
        fin_name: data.structure.formInfo.find(element => element.type === 'fin_name').value,
        fin_instructions: data.structure.formInfo.find(element => element.type === 'fin_instructions').value,
        swe_name: data.structure.formInfo.find(element => element.type === 'swe_name').value,
        swe_instructions: data.structure.formInfo.find(element => element.type === 'swe_instructions').value
      },
      SelfAssessment,
      {
        pathToId: ['body', 'data', 'id']
      }
    )
  })

  describe('PUT /toggle/:id', () => {
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
      structure: {},
      course_instance_id: 1
    }
    const data = [
      { attribute: 'active' },
      { attribute: 'open' },
      { attribute: 'show_feedback' }
    ]
    const options = data.map(dataElement => ({
      method: 'put',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.teacher}`],
        send: dataElement
      }
    }))
    const ids = {}

    beforeAll((done) => {
      SelfAssessment.create(selfAssesmentData).then((selfAssesment) => {
        ids.selfAssesment = selfAssesment.id
        options.forEach((optionsElement) => {
          // eslint-disable-next-line no-param-reassign
          optionsElement.route = `/api/selfassesment/toggle/${selfAssesment.id}`
        })
        done()
      }).catch(done)
    })

    afterEach((done) => {
      setTimeout(() => {
        SelfAssessment.update(selfAssesmentData, {
          where: {
            id: ids.selfAssesment
          }
        }).then(() => done()).catch(done)
      }, 200)
    })

    afterAll((done) => {
      SelfAssessment.destroy({
        where: {
          id: ids.selfAssesment
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options[0])

    testTeacherOnCoursePrivilege(options[0])

    const attributes = [
      'active',
      'open',
      'show_feedback'
    ]
    options.forEach((optionsElement, index) => {
      describe(`with attribute ${attributes[index]}`, () => {
        testBody(optionsElement, {
          common: {
            message: expect.any(String),
            assessment: {
              ...selfAssesmentData,
              id: asymmetricMatcher(actual => actual === ids.selfAssesment),
              [(attributes[index])]: true
            }
          }
        })

        testDatabaseSave(
          optionsElement,
          {
            ...selfAssesmentData,
            id: asymmetricMatcher(actual => actual === ids.selfAssesment),
            [(attributes[index])]: true
          },
          SelfAssessment,
          {
            pathToId: ['body', 'assessment', 'id'],
            delay: 100
          }
        )
      })
    })
  })
})
