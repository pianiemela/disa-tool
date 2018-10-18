const faker = require('faker')
const logger = require('../utils/logger')
const { AssessmentResponse, CoursePerson, Person } = require('./models')
const assessmentResponseService = require('../services/assesment_response_service')

const randGrade = () => (Math.floor(Math.random() * 5 + 1))

const textResp = () => `
${faker.hacker.phrase()} ${faker.hacker.phrase()} ${faker.hacker.phrase()} ${faker.hacker.phrase()}`

const genResp = assessmentId => ({
  assessmentId,
  course_instance_id: 1,
  questionModuleResponses: [{
    id: 1,
    responseText: textResp(),
    textFieldOn: true,
    grade: randGrade(),
    name: 'Yhtälöryhmät'
  }, {
    id: 2,
    responseText: textResp(),
    textFieldOn: true,
    grade: randGrade(),
    name: 'Vektoriavaruudet'
  }, {
    id: 3,
    responseText: textResp(),
    textFieldOn: true,
    grade: randGrade(),
    name: 'Virittäminen ja vapaus'
  }, {
    id: 4,
    responseText: textResp(),
    textFieldOn: true,
    grade: randGrade(),
    name: 'Matriisit'
  }],
  openQuestionResponses: [],
  assessmentType: 'category',
  finalGradeResponse: {
    responseText: textResp(),
    grade: randGrade(),
    headers: [{
      id: 1,
      prefix: 'Fin:',
      value: 'Anna itsellesi loppuarvosana kurssista',
      type: 'fin_name'
    }, {
      id: 2,
      prefix: 'Eng:',
      value: 'Give yourself a final grade for the course',
      type: 'eng_name'
    }, {
      id: 3,
      prefix: 'Swe:',
      value: 'Låta en final grad till själv',
      type: 'swe_name'
    }]
  },
  finalHeaders: [{
    id: 6,
    prefix: 'Fin:',
    value: 'Loppuarvio',
    type: 'fin_name'
  }, {
    id: 7,
    prefix: 'Eng:',
    value: 'Final grade',
    type: 'eng_name'
  }, {
    id: 8,
    prefix: 'Swe:',
    value: 'Final grääd',
    type: 'swe_name'
  }]
})

const run = async (courseId, assessmentId) => {
  const people = await Person.findAll({ include: { model: CoursePerson, where: { course_instance_id: courseId } } })
  await Promise.all(people.map(async (person) => {
    const toCreate = genResp(assessmentId)
    const response = await assessmentResponseService.create(person, assessmentId, toCreate)
    try {
      const verification = await assessmentResponseService.verifyAssessmentGrade(response, 'fin')
      response.response.verification = verification
      const feedback = await assessmentResponseService.generateFeedback(response, 'fin')
      response.response.feedback = feedback
    } catch (e) {
      logger.error(e)
    }
    // THE RESPONSE IS NOT SAVED UNTIL SAVE IS EXPLICITLY CALLED HERE
    const completeResponse = await response.save()
    logger.debug('response created: ', person.studentnumber)
    return completeResponse
  }))
  logger.info('done')
  process.exit()
}

run(process.argv[2], process.argv[3])
