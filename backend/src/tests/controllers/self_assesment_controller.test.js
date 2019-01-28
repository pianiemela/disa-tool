const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { SelfAssessment } = require('../../database/models.js')


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
              value: 'Låta en final grad till själv',
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
              value: 'Ruotsiksi sama',
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
              value: 'Öppnä jotain',
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
              value: 'Final grääd',
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
})
