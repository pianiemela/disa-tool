const {
  testTeacherOnCoursePrivilege,
  testHeaders,
  testBody,
  testDatabaseSave,
  testDatabaseDestroy,
  asymmetricMatcher,
  testStatusCode
} = require('../testUtils')
const { Type, TypeHeader, CourseInstance, CoursePerson } = require('../../database/models.js')

describe('type_controller', () => {
  const courseInstanceData = {
    course_id: 1,
    eng_name: 'en',
    fin_name: 'fn',
    swe_name: 'sn',
    active: false
  }
  const typeHeaderData = {
    eng_name: 'eng root',
    fin_name: 'fin root',
    swe_name: 'swe root',
    order: 20
  }
  const ids = {}

  beforeAll((done) => {
    CourseInstance.create(courseInstanceData).then((courseInstance) => {
      ids.courseInstance = courseInstance.id
      Promise.all([
        TypeHeader.create({
          ...typeHeaderData,
          course_instance_id: courseInstance.id
        }),
        CoursePerson.create({
          role: 'TEACHER',
          course_instance_id: courseInstance.id,
          person_id: 424
        }),
        CoursePerson.create({
          role: 'STUDENT',
          course_instance_id: courseInstance.id,
          person_id: 421
        })
      ]).then(([typeHeader]) => {
        ids.typeHeader = typeHeader.id
        done()
      }).catch(done)
    }).catch(done)
  })

  afterAll((done) => {
    CourseInstance.destroy({
      where: { id: ids.courseInstance }
    }).then(() => done())
  })

  describe('POST /create', () => {
    const data = {
      eng_name: '8e',
      fin_name: '8f',
      swe_name: '8s',
      multiplier: 1,
      order: 23
    }
    const options = {
      route: '/api/types/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    beforeAll(() => {
      data.type_header_id = ids.typeHeader
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number),
          type_header_id: asymmetricMatcher(actual => actual === ids.typeHeader),
          multiplier: data.multiplier,
          order: data.order
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

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        ...data
      },
      Type,
      {
        disallowId: true
      }
    )
  })

  describe('POST /headers/create', () => {
    const data = {
      eng_name: 'eng unique name',
      fin_name: 'fin unique name',
      swe_name: 'swe unique name',
      order: 20
    }
    const options = {
      route: '/api/types/headers/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    beforeAll(() => {
      data.course_instance_id = ids.courseInstance
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          id: expect.any(Number),
          order: data.order
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

    testDatabaseSave(
      options,
      {
        id: expect.any(Number),
        ...data
      },
      TypeHeader,
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

    beforeEach((done) => {
      Type.create({
        type_header_id: ids.typeHeader,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        order: 1
      }).then((result) => {
        ids.type = result.get({ plain: true }).id
        options.route = `/api/types/${ids.type}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testStatusCode({ ...options, route: '/api/types/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.type),
          type_header_id: asymmetricMatcher(actual => actual === ids.typeHeader),
          task_ids: []
        }
      }
    })

    testDatabaseDestroy(options, Type, { delay: 2000 })
  })

  describe('DELETE /headers/:id', () => {
    const options = {
      method: 'delete',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    beforeEach((done) => {
      TypeHeader.create({
        course_instance_id: ids.courseInstance,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        order: 1
      }).then((result) => {
        ids.deleteTypeHeader = result.get({ plain: true }).id
        options.route = `/api/types/headers/${ids.deleteTypeHeader}`
        done()
      })
    })

    testTeacherOnCoursePrivilege(options)

    testHeaders(options)

    testStatusCode({ ...options, route: '/api/types/headers/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.deleteTypeHeader)
        }
      }
    })

    describe('deletion cascades and', () => {
      beforeEach((done) => {
        Type.create({
          type_header_id: ids.deleteTypeHeader,
          eng_name: 'ent',
          fin_name: 'fnt',
          swe_name: 'snt',
          order: 1
        }).then((result) => {
          ids.deleteHeaderType = result.get({ plain: true }).id
          done()
        })
      })

      testDatabaseDestroy(options, TypeHeader, {
        delay: 2000,
        cascade: [
          {
            model: Type,
            getId: () => ids.deleteHeaderType
          }
        ]
      })
    })
  })

  describe('GET /:id', () => {
    const options = {
      route: '/api/types/1',
      method: 'get',
      preamble: {}
    }
    const expectedBody = {
      common: {
        message: expect.any(String),
        data: {
          id: 1
        }
      }
    }

    beforeAll((done) => {
      Type.findByPk(1).then((result) => {
        expectedBody.common.data.eng_name = result.eng_name
        expectedBody.common.data.fin_name = result.fin_name
        expectedBody.common.data.swe_name = result.swe_name
        expectedBody.common.data.multiplier = result.multiplier
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
      multiplier: 0.7,
      order: 4.5
    }
    const options = {
      route: '/api/types',
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const databaseExpectation = {}

    beforeAll((done) => {
      Type.create({
        type_header_id: ids.typeHeader,
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        multiplier: 1,
        order: 11
      }).then((result) => {
        ids.editType = result.id
        options.route = `${options.route}/${ids.editType}`
        databaseExpectation.created_at = result.created_at
        databaseExpectation.updated_at = result.updated_at
        done()
      })
    })

    afterEach((done) => {
      Type.findByPk(ids.editType).then(instance => instance.update({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        multiplier: 1,
        order: 11
      }).then((result) => {
        databaseExpectation.updated_at = result.updated_at
        done()
      }).catch(done)
      ).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/types/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.editType),
          multiplier: data.multiplier,
          type_header_id: asymmetricMatcher(actual => actual === ids.typeHeader),
          order: data.order
        }
      },
      eng: {
        edited: {
          name: data.eng_name
        }
      },
      fin: {
        edited: {
          name: data.fin_name
        }
      },
      swe: {
        edited: {
          name: data.swe_name
        }
      }
    })

    testDatabaseSave(
      options,
      {
        ...data,
        id: asymmetricMatcher(actual => actual === ids.editType),
        type_header_id: asymmetricMatcher(actual => actual === ids.typeHeader),
        created_at: asymmetricMatcher(actual => !(
          actual < databaseExpectation.created_at || actual > databaseExpectation.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.updated_at)
      },
      Type,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })

  describe('GET /headers/:id', () => {
    const data = {
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn',
      order: 34
    }
    const options = {
      route: '/api/types/headers',
      method: 'get',
      preamble: {}
    }

    beforeAll((done) => {
      TypeHeader.create({
        ...data,
        course_instance_id: ids.courseInstance
      }).then((result) => {
        ids.getHeader = result.get({ plain: true }).id
        options.route = `${options.route}/${ids.getHeader}`
        done()
      }).catch(done)
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/types/headers/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          ...data,
          id: asymmetricMatcher(actual => actual === ids.getHeader)
        }
      }
    })
  })

  describe('PUT headers/:id', () => {
    const data = {
      eng_name: 'new en',
      fin_name: 'new fn',
      swe_name: 'new sn',
      order: 4.5
    }
    const options = {
      route: '/api/types/headers',
      method: 'put',
      preamble: {
        send: data,
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }
    const databaseExpectation = {}

    beforeAll((done) => {
      TypeHeader.create({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        course_instance_id: ids.courseInstance,
        order: 11
      }).then((result) => {
        ids.editHeader = result.get({ plain: true }).id
        options.route = `${options.route}/${ids.editHeader}`
        databaseExpectation.created_at = result.get({ plain: true }).created_at
        done()
      }).catch(done)
    })

    afterEach((done) => {
      TypeHeader.findByPk(ids.editHeader).then(
        instance => instance.update({
          eng_name: 'en',
          fin_name: 'fn',
          swe_name: 'sn',
          order: 11
        }).then(() => done()).catch(done)
      ).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/types/headers/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.editHeader),
          order: data.order
        }
      },
      eng: {
        edited: {
          name: data.eng_name
        }
      },
      fin: {
        edited: {
          name: data.fin_name
        }
      },
      swe: {
        edited: {
          name: data.swe_name
        }
      }
    })

    testDatabaseSave(
      options,
      {
        ...data,
        id: asymmetricMatcher(actual => actual === ids.editHeader),
        course_instance_id: asymmetricMatcher(actual => actual === ids.courseInstance),
        created_at: asymmetricMatcher(actual => !(
          actual < databaseExpectation.created_at || actual > databaseExpectation.created_at
        )),
        updated_at: asymmetricMatcher(actual => actual > databaseExpectation.created_at)
      },
      TypeHeader,
      {
        pathToId: ['body', 'edited', 'id'],
        includeTimestamps: false
      }
    )
  })

  describe('GET /course/:id', () => {
    const typeData = [
      {
        eng_name: 'e',
        fin_name: 'f',
        swe_name: 's',
        multiplier: 1,
        order: 1
      },
      {
        eng_name: 'e1',
        fin_name: 'f1',
        swe_name: 's1',
        multiplier: 0.5,
        order: 2
      }
    ]
    const options = {
      method: 'get',
      route: '/api/types/course',
      preamble: {
        set: ['Authorization', `Bearer ${tokens.teacher}`]
      }
    }

    beforeAll((done) => {
      CourseInstance.create(courseInstanceData).then((courseInstance) => {
        ids.getCourseCourseInstance = courseInstance.id
        options.route = `${options.route}/${courseInstance.id}`
        TypeHeader.create({
          ...typeHeaderData,
          course_instance_id: courseInstance.id
        }).then((typeHeader) => {
          ids.getCourseTypeHeader = typeHeader.id
          Promise.all(typeData.map(data => Type.create({
            ...data,
            type_header_id: typeHeader.id
          }))).then((types) => {
            ids.getCourseTypes = types.map(type => type.id)
            done()
          }).catch(done)
        }).catch(done)
      }).catch(done)
    })

    afterAll((done) => {
      CourseInstance.destroy({
        where: { id: ids.getCourseCourseInstance }
      }).then(() => done())
    })

    testHeaders(options)

    testStatusCode(options, 200)

    const expectedData = lang => expect.arrayContaining(typeData.map((type, index) => ({
      id: asymmetricMatcher(actual => actual === ids.getCourseTypes[index]),
      text: `${typeHeaderData[`${lang}_name`]} ${type[`${lang}_name`]}`
    })))

    testBody(options, {
      common: {
        message: expect.any(String)
      },
      eng: {
        data: expectedData('eng')
      },
      fin: {
        data: expectedData('fin')
      },
      swe: {
        data: expectedData('swe')
      }
    })
  })
})
