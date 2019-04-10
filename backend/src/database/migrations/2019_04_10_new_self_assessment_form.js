const {
  SelfAssessment,
  SelfAssessmentForm,
  AssessmentResponse,
  Response,
  OpenQuestion,
  CategoryQuestion,
  ObjectiveQuestion,
  FinalGradeQuestion,
  OpenResponse,
  CategoryResponse,
  ObjectiveResponse,
  FinalGradeResponse,
  CourseInstance,
  Category,
  Objective,
  Grade,
  Person
} = require('../models')

const up = async (queryInterface, Sequelize, done) => {
  await Promise.all([
    queryInterface.createTable(
      'self_assessment_form',
      {
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
        eng_name: { type: Sequelize.STRING, allowNull: false },
        fin_name: { type: Sequelize.STRING, allowNull: false },
        swe_name: { type: Sequelize.STRING, allowNull: false },
        eng_instructions: { type: Sequelize.TEXT, allowNull: false },
        fin_instructions: { type: Sequelize.TEXT, allowNull: false },
        swe_instructions: { type: Sequelize.TEXT, allowNull: false },
        open: { type: Sequelize.BOOLEAN },
        active: { type: Sequelize.BOOLEAN },
        show_feedback: { type: Sequelize.BOOLEAN },
        type: {
          type: Sequelize.ENUM,
          allowNull: false,
          values: ['CATEGORIES', 'OBJECTIVES']
        },
        course_instance_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: CourseInstance,
            key: 'id'
          },
          onDelete: 'CASCADE'
        }
      },
      {
        tableName: 'self_assessment_form',
        underscored: true,
        timestamps: true
      }
    ),
    queryInterface.createTable(
      'final_grade_question',
      {
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
        self_assessment_form_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: true,
          references: {
            model: SelfAssessmentForm,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        eng_prompt: { type: Sequelize.TEXT, allowNull: false },
        fin_prompt: { type: Sequelize.TEXT, allowNull: false },
        swe_prompt: { type: Sequelize.TEXT, allowNull: false },
        text_field: { type: Sequelize.BOOLEAN, allowNull: false }
      },
      {
        tableName: 'final_grade_question',
        underscored: true,
        timestamps: true
      }
    ),
    queryInterface.createTable(
      'open_question',
      {
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
        self_assessment_form_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: SelfAssessmentForm,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        eng_prompt: { type: Sequelize.TEXT, allowNull: false },
        fin_prompt: { type: Sequelize.TEXT, allowNull: false },
        swe_prompt: { type: Sequelize.TEXT, allowNull: false },
        order: { type: Sequelize.FLOAT }
      },
      {
        tableName: 'open_question',
        underscored: true,
        timestamps: true
      }
    ),
    queryInterface.createTable(
      'category_question',
      {
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
        self_assessment_form_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: SelfAssessmentForm,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        category_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: Category,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        text_field: { type: Sequelize.BOOLEAN, allowNull: false },
        order: { type: Sequelize.FLOAT }
      },
      {
        tableName: 'category_question',
        underscored: true,
        timestamps: true
      }
    ),
    queryInterface.createTable(
      'objective_question',
      {
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
        self_assessment_form_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: SelfAssessmentForm,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        objective_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: Objective,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        order: { type: Sequelize.FLOAT }
      },
      {
        tableName: 'objective_question',
        underscored: true,
        timestamps: true
      }
    ),
    queryInterface.createTable(
      'response',
      {
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
        person_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: Person,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        self_assessment_form_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: SelfAssessmentForm,
            key: 'id'
          },
          onDelete: 'CASCADE'
        }
      },
      {
        tableName: 'response',
        underscored: true,
        timestamps: true
      }
    ),
    queryInterface.createTable(
      'final_grade_response',
      {
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
        response_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: Response,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        final_grade_question_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: FinalGradeQuestion,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        grade_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: Grade,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        text: { type: Sequelize.TEXT }
      },
      {
        tableName: 'final_grade_response',
        underscored: true,
        timestamps: true
      }
    ),
    queryInterface.createTable(
      'open_response',
      {
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
        response_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: Response,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        open_question_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: OpenQuestion,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        text: { type: Sequelize.TEXT, allowNull: false }
      },
      {
        tableName: 'open_response',
        underscored: true,
        timestamps: true
      }
    ),
    queryInterface.createTable(
      'category_response',
      {
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
        response_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: Response,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        category_question_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: CategoryQuestion,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        grade_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: Grade,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        text: { type: Sequelize.TEXT }
      },
      {
        tableName: 'category_response',
        underscored: true,
        timestamps: true
      }
    ),
    queryInterface.createTable(
      'objective_response',
      {
        id: { primaryKey: true, type: Sequelize.BIGINT, autoIncrement: true },
        response_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: Response,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        objective_question_id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          unique: false,
          references: {
            model: ObjectiveQuestion,
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        answer: { type: Sequelize.INTEGER, allowNull: false }
      },
      {
        tableName: 'objective_response',
        underscored: true,
        timestamps: true
      }
    )
  ])

  const selfAssessments = await SelfAssessment.findAll()
  await Promise.all(selfAssessments.map(selfAssessment => SelfAssessmentForm.create({
    id: selfAssessment.id,
    eng_name: selfAssessment.eng_name,
    fin_name: selfAssessment.fin_name,
    swe_name: selfAssessment.swe_name,
    eng_instructions: selfAssessment.eng_instructions,
    fin_instructions: selfAssessment.fin_instructions,
    swe_instructions: selfAssessment.swe_instructions,
    open: selfAssessment.open,
    active: selfAssessment.active,
    show_feedback: selfAssessment.show_feedback,
    type: 'CATEGORIES',
    course_instance_id: selfAssessment.course_instance_id
  })))
  await queryInterface.sequelize.query(`SELECT SETVAL('self_assessment_form_id_seq', ${selfAssessments.reduce(
    (acc, curr) => Math.max(acc, curr.id),
    0
  )});`)

  const questions = await Promise.all(selfAssessments.reduce(
    (acc, { id, structure }) => {
      const openQuestions = structure.openQuestions.map((openQuestion, index) => OpenQuestion.create({
        self_assessment_form_id: id,
        eng_prompt: openQuestion.eng_name,
        fin_prompt: openQuestion.fin_name,
        swe_prompt: openQuestion.swe_name,
        order: index + 1
      }))
      let questionModules
      if (structure.type === 'category') {
        questionModules = structure.questionModules
          .filter(questionModule => questionModule.includedInAssesment)
          .map((questionModule, index) => CategoryQuestion.create({
            self_assessment_form_id: id,
            category_id: questionModule.id,
            text_field: questionModule.textFieldOn,
            order: index + 1
          }))
      } else {
        let runningOrder = 0
        questionModules = structure.questionModules.reduce(
          (acc2, { objectives }) => acc2.concat(
            objectives
              .filter(({ includedInAssesment }) => includedInAssesment)
              .map((objective) => {
                runningOrder += 1
                return ObjectiveQuestion.create({
                  self_assessment_form_id: id,
                  objective_id: objective.id,
                  order: runningOrder
                })
              })
          ),
          []
        )
      }
      const finalGradeQuestions = []
      if (structure.finalGrade && structure.finalGrade.includedInAssesment) {
        finalGradeQuestions.push(FinalGradeQuestion.create({
          self_assessment_form_id: id,
          eng_prompt: structure.finalGrade.headers.find(({ type }) => type === 'eng_name').value,
          fin_prompt: structure.finalGrade.headers.find(({ type }) => type === 'fin_name').value,
          swe_prompt: structure.finalGrade.headers.find(({ type }) => type === 'swe_name').value,
          text_field: structure.finalGrade.textFieldOn
        }))
      }
      return acc.concat([
        ...openQuestions,
        ...questionModules,
        ...finalGradeQuestions
      ])
    },
    []
  ))

  const assessmentResponses = await AssessmentResponse.findAll()
  const responses = await Promise.all(assessmentResponses.map(assessmentResponse => Response.create({
    person_id: assessmentResponse.person_id,
    self_assessment_form_id: assessmentResponse.self_assessment_id
  })))

  await Promise.all(assessmentResponses.reduce(
    (acc, assessmentResponse, index) => {
      const openResponses = assessmentResponse.openQuestionResponses.map(
        ({ name, responseText }) => OpenResponse.create({
          response_id: responses[index].id,
          open_question_id: questions.find(question => (
            question.self_assessment_form_id === assessmentResponse.assessmentId
            && (
              question.eng_prompt === name
              || question.fin_prompt === name
              || question.swe_prompt === name
            )
          )).id,
          text: responseText
        })
      )
      const questionModuleResponses = assessmentResponse.questionModuleResponses.map(questionModuleResponse => (
        questionModuleResponse.responseText
          ? CategoryResponse.create({
            response_id: responses[index].id,
            category_question_id: questions.find(question => (
              question.category_id === questionModuleResponse.id
              && question.self_assessment_form_id === assessmentResponse.assessmentId
            )).id,
            text: questionModuleResponse.responseText,
            grade_id: questionModuleResponse.grade
          })
          : ObjectiveResponse.create({
            response_id: responses[index].id,
            objective_question_id: questions.find(question => (
              question.objective_id === questionModuleResponse.id
              && question.self_assessment_form_id === assessmentResponse.assessmentId
            )).id,
            answer: Number(questionModuleResponse.grade) + 1
          })
      ))
      const finalGradeResponses = []
      const finalGradeQuestion = questions.find(question => (
        question.Model.name === 'final_grade_question'
        && question.self_assessment_form_id === assessmentResponse.assessmentId
      ))
      if (assessmentResponse.finalGradeResponse && finalGradeQuestion) {
        finalGradeResponses.push(FinalGradeResponse.create({
          response_id: responses[index].id,
          final_grade_question_id: finalGradeQuestion.id,
          text: assessmentResponse.finalGrade.responseText || '',
          grade_id: assessmentResponse.finalGrade.grade
        }))
      }
      return acc.concat([
        ...openResponses,
        ...questionModuleResponses,
        ...finalGradeResponses
      ])
    },
    []
  ))
  done()
}

module.exports = {
  up: (queryInterface, Sequelize, done) => up(queryInterface, Sequelize, done),
  down: () => {
    // just don't cock it up and this won't be needed
  }
}