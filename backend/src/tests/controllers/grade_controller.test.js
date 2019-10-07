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
  Grade,
  CourseInstance,
  SkillLevel,
  CoursePerson,
  Category,
  CategoryGrade
} = require('../../database/models.js')

describe('grade controller', () => {
  const gradeData = {
    eng_name: 'ge',
    fin_name: 'gf',
    swe_name: 'gs',
    needed_for_grade: 0.2,
    prerequisite: null,
    order: 1
  }

  const ids = {}

  beforeAll((done) => {
    CourseInstance.create({
      eng_name: 'cie',
      fin_name: 'cif',
      swe_name: 'cis',
      course_id: 1
    }).then((courseInstance) => {
      ids.courseInstance = courseInstance.id
      Promise.all([
        CoursePerson.create({
          person_id: 410,
          course_instance_id: courseInstance.id,
          role: 'TEACHER'
        }),
        SkillLevel.create({
          eng_name: 'le',
          fin_name: 'lf',
          swe_name: 'ls',
          order: 1,
          course_instance_id: courseInstance.id
        })
      ]).then((([, skillLevel]) => {
        ids.skillLevel = skillLevel.id
        Grade.create({
          ...gradeData,
          skill_level_id: skillLevel.id
        }).then((grade) => {
          ids.grade = grade.id
          done()
        }).catch(done)
      })).catch(done)
    }).catch(done)
  })

  afterAll((done) => {
    Grade.destroy({
      where: {
        id: ids.grade
      }
    }).then(() => done()).catch(done)
  })

  describe('GET /course/:id', () => {
    const options = {
      route: '/api/grades/course/1',
      method: 'get',
      preamble: {}
    }

    testHeaders(options)

    testStatusCode(options, 200)
  })

  describe('POST /create', () => {
    const skillLevelData = {
      eng_name: 'l2e',
      fin_name: 'l2f',
      swe_name: 'l2s',
      order: 2
    }
    const data = {
      eng_name: 'en',
      fin_name: 'fn',
      swe_name: 'sn',
      needed_for_grade: 0.5,
      order: 3
    }
    const options = {
      route: '/api/grades/create',
      method: 'post',
      preamble: {
        send: data,
        set: ['uid', 'mikkoti']
      }
    }

    beforeAll((done) => {
      data.prerequisite = ids.grade
      SkillLevel.create({
        ...skillLevelData,
        course_instance_id: ids.courseInstance
      }).then((skillLevel) => {
        data.skill_level_id = skillLevel.id
        done()
      }).catch(done)
    })

    afterEach((done) => {
      Grade.destroy({
        where: {
          skill_level_id: data.skill_level_id
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/grades/course/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        created: {
          skill_level_id: asymmetricMatcher(actual => actual === data.skill_level_id),
          needed_for_grade: data.needed_for_grade,
          prerequisite: asymmetricMatcher(actual => actual === ids.grade),
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

    testDatabaseSave(options, {
      ...data,
      id: expect.any(Number)
    }, Grade, { disallowId: true })
  })

  describe('DELETE /:id', () => {
    const options = {
      method: 'delete',
      preamble: {
        set: ['uid', 'mikkoti']
      }
    }

    beforeEach((done) => {
      Grade.create({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        skill_level_id: ids.skillLevel,
        needed_for_grade: 0.1,
        prerequisite: null,
        order: 1
      }).then((result) => {
        ids.toDelete = result.get({ plain: true }).id
        options.route = `/api/grades/${ids.toDelete}`
        Grade.findByPk(ids.grade).then((instance) => {
          // This is done to assert that a grade pointing
          // to the deleted grade as its prerequisite will not be destroyed.
          instance.update({
            prerequisite: ids.toDelete
          }).then(() => done()).catch(done)
        }).catch(done)
      }).catch(done)
    })

    afterEach((done) => {
      Grade.destroy({
        where: {
          id: ids.toDelete
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/grades/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        deleted: {
          id: asymmetricMatcher(actual => actual === ids.toDelete)
        }
      }
    })

    testDatabaseDestroy(options, Grade, { delay: 2000 })
  })

  describe('GET /:id', () => {
    const options = {
      method: 'get',
      preamble: {}
    }

    beforeAll(() => {
      options.route = `/api/grades/${ids.grade}`
    })

    testHeaders(options)

    testStatusCode(options, 200)

    testStatusCode({ ...options, route: '/api/grades/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        data: {
          ...gradeData,
          id: asymmetricMatcher(actual => actual === ids.grade),
          skill_level_id: asymmetricMatcher(actual => actual === ids.skillLevel)
        }
      }
    })
  })

  describe('PUT /:id', () => {
    const skillLevelData = {
      eng_name: 'l3e',
      fin_name: 'l3f',
      swe_name: 'l3s',
      order: 3
    }
    const data = {
      eng_name: 'new en',
      fin_name: 'new fn',
      swe_name: 'new sn',
      needed_for_grade: 0.8,
      order: 4.5
    }
    const options = {
      route: '/api/grades',
      method: 'put',
      preamble: {
        send: data,
        set: ['uid', 'mikkoti']
      }
    }
    const databaseExpectation = {}

    beforeAll((done) => {
      data.prerequisite = ids.grade
      Promise.all([
        Grade.create({
          eng_name: 'en',
          fin_name: 'fn',
          swe_name: 'sn',
          skill_level_id: ids.skillLevel,
          needed_for_grade: 0.2,
          prerequisite: null,
          order: 11
        }),
        SkillLevel.create({
          ...skillLevelData,
          course_instance_id: ids.courseInstance
        })
      ]).then(([toEdit, newSkillLevel]) => {
        ids.newSkillLevel = newSkillLevel.id
        data.skill_level_id = newSkillLevel.id
        ids.toEdit = toEdit.id
        options.route = `${options.route}/${toEdit.id}`
        databaseExpectation.created_at = toEdit.created_at
        databaseExpectation.updated_at = toEdit.updated_at
        done()
      }).catch(done)
    })

    afterEach((done) => {
      Grade.findByPk(ids.toEdit).then(instance => instance.update({
        eng_name: 'en',
        fin_name: 'fn',
        swe_name: 'sn',
        skill_level_id: ids.skillLevel,
        needed_for_grade: 0.2,
        prerequisite: null,
        order: 11
      }).then((result) => {
        databaseExpectation.updated_at = result.updated_at
        done()
      }).catch(done)
      ).catch(done)
    })

    afterAll((done) => {
      Grade.destroy({
        where: {
          id: ids.toEdit
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testStatusCode({ ...options, route: '/api/grades/999999' }, 404)

    testBody(options, {
      common: {
        message: expect.any(String),
        edited: {
          id: asymmetricMatcher(actual => actual === ids.toEdit),
          skill_level_id: asymmetricMatcher(actual => actual === ids.newSkillLevel),
          needed_for_grade: data.needed_for_grade,
          prerequisite: asymmetricMatcher(actual => actual === ids.grade),
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

    testDatabaseSave(options, {
      ...data,
      id: asymmetricMatcher(actual => actual === ids.toEdit),
      skill_level_id: asymmetricMatcher(actual => actual === ids.newSkillLevel),
      created_at: asymmetricMatcher(
        actual => !(actual < databaseExpectation.created_at || actual > databaseExpectation.created_at)
      ),
      updated_at: asymmetricMatcher(actual => actual > databaseExpectation.updated_at)
    }, Grade, {
      pathToId: ['body', 'edited', 'id'],
      includeTimestamps: false
    })
  })

  describe('PUT /category-grades', () => {
    const courseInstanceData = {
      eng_name: 'cie',
      fin_name: 'cif',
      swe_name: 'cis',
      active: false,
      course_id: 1
    }
    const skillLevelData = {
      eng_name: 'le',
      fin_name: 'lf',
      swe_name: 'ls'
    }
    const categoryData = {
      eng_name: 'ce',
      fin_name: 'cf',
      swe_name: 'cs'
    }
    const catGradeData = [
      {
        eng_name: 'ge',
        fin_name: 'gf',
        swe_name: 'gs',
        needed_for_grade: 1,
        prerequisite: null,
        order: 1
      },
      {
        eng_name: 'g2e',
        fin_name: 'g2f',
        swe_name: 'g2s',
        needed_for_grade: 1,
        prerequisite: null,
        order: 2
      }
    ]
    const data = {
      categoryGrades: [{
        id: 1,
        neededForGrade: 0.8
      }]
    }

    const options = {
      method: 'put',
      route: '/api/grades/category-grades',
      preamble: {
        set: ['uid', 'mikkoti'],
        send: data
      }
    }

    beforeAll((done) => {
      CourseInstance.create(courseInstanceData).then((catCourseInstance) => {
        ids.catCourseInstance = catCourseInstance.id
        data.courseId = catCourseInstance.id
        Promise.all([
          SkillLevel.create({
            ...skillLevelData,
            course_instance_id: catCourseInstance.id
          }),
          Category.create({
            ...categoryData,
            course_instance_id: catCourseInstance.id
          }),
          CoursePerson.create({
            person_id: 410,
            course_instance_id: catCourseInstance.id,
            role: 'TEACHER'
          })
        ]).then(([catSkillLevel, catCategory]) => {
          ids.catSkillLevel = catSkillLevel.id
          ids.catCategory = catCategory.id
          Promise.all(catGradeData.map(rowData => Grade.create({
            ...rowData,
            skill_level_id: catSkillLevel.id
          }))).then((catGrades) => {
            ids.catGrades = catGrades.map(grade => grade.id)
            Promise.all(ids.catGrades.map(gradeId => CategoryGrade.create({
              needed_for_grade: 1,
              category_id: catCategory.id,
              grade_id: gradeId
            }))).then((catCategoryGrades) => {
              ids.catCategoryGrades = catCategoryGrades.map(categoryGrade => categoryGrade.id)
              data.categoryGrades = data.categoryGrades.concat(
                catCategoryGrades.map(categoryGrade => ({
                  id: categoryGrade.id,
                  neededForGrade: 0.8
                }))
              )
              done()
            }).catch(done)
          }).catch(done)
        }).catch(done)
      }).catch(done)
    })

    afterEach((done) => {
      CategoryGrade.update({
        needed_for_grade: 1
      }, {
        where: {
          category_id: ids.catCategory
        }
      }).then(() => done()).catch(done)
    })

    afterAll((done) => {
      CourseInstance.destroy({
        where: {
          id: ids.catCourseInstance
        }
      }).then(() => done()).catch(done)
    })

    testHeaders(options)

    testTeacherOnCoursePrivilege(options)

    testBody(options, {
      common: {
        message: expect.any(String),
        updatedCategoryGrades: [
          {
            id: asymmetricMatcher(actual => ids.catCategoryGrades.includes(actual)),
            category_id: asymmetricMatcher(actual => actual === ids.catCategory),
            needed_for_grade: 0.8
          },
          {
            id: asymmetricMatcher(actual => ids.catCategoryGrades.includes(actual)),
            category_id: asymmetricMatcher(actual => actual === ids.catCategory),
            needed_for_grade: 0.8
          }
        ]
      }
    })

    testDatabaseSave(
      options,
      {
        id: asymmetricMatcher(actual => ids.catCategoryGrades.includes(actual)),
        category_id: asymmetricMatcher(actual => actual === ids.catCategory),
        needed_for_grade: 0.8
      },
      CategoryGrade,
      {
        pathToId: ['body', 'updatedCategoryGrades', 1, 'id']
      }
    )

    describe('when category grades are not under the specified course instance', () => {
      const derivativeOptions = { ...options }
      beforeAll(() => {
        derivativeOptions.preamble.send = {
          ...data,
          courseId: 1
        }
      })

      testBody(derivativeOptions, {
        common: {
          message: expect.any(String),
          updatedCategoryGrades: []
        }
      })

      testDatabaseSave(
        options,
        {
          id: asymmetricMatcher(actual => actual === ids.catCategoryGrades[0]),
          category_id: asymmetricMatcher(actual => actual === ids.catCategory),
          needed_for_grade: 1
        },
        CategoryGrade,
        {
          text: 'does not touch unauthorized database rows.',
          findBy: () => ids.catCategoryGrades[0]
        }
      )
    })
  })
})
