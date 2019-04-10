const faker = require('faker')
const {
  TaskResponse,
  Task,
  SkillLevel,
  Category,
  Grade,
  CategoryGrade,
  Person,
  CoursePerson,
  SelfAssessmentForm,
  CategoryQuestion,
  Response,
  CategoryResponse
} = require('./models')

const run = async () => {
  console.log('creating data...')
  const personData = []
  for (let index = 0; index < 500; index += 1) {
    personData.push({
      name: faker.name.findName(),
      studentnumber: String(12348765 + index),
      role: 'STUDENT'
    })
  }
  const people = await Promise.all(personData.map(person => Person.create(person)))
  await Promise.all(people.map(person => CoursePerson.create({
    person_id: person.id,
    course_instance_id: 1,
    role: 'STUDENT'
  })))
  const tasks = await Task.findAll({
    where: { course_instance_id: 1 },
    attributes: ['id', 'max_points']
  })
  await Promise.all(tasks.reduce(
    (acc, task) => acc.concat(people.map((person) => {
      const points = Math.floor((Math.random() * (task.max_points + 1)))
      return TaskResponse.create({
        task_id: task.id,
        person_id: person.id,
        points
      })
    })),
    []
  ))
  const selfAssessmentForm = await SelfAssessmentForm.create({
    course_instance_id: 1,
    open: false,
    active: true,
    show_feedback: true,
    eng_name: 'en',
    fin_name: 'fn',
    swe_name: 'sn',
    eng_instructions: 'ei',
    fin_instructions: 'fi',
    swe_instructions: 'si',
    type: 'CATEGORIES'
  })
  const categories = await Category.findAll({
    where: {
      course_instance_id: 1
    }
  })
  const categoryQuestions = await Promise.all(categories.map(category => CategoryQuestion.create({
    self_assessment_form_id: selfAssessmentForm.id,
    category_id: category.id,
    order: category.order,
    text_field: true
  })))
  const responses = await Promise.all(people.map(person => Response.create({
    person_id: person.id,
    self_assessment_form_id: selfAssessmentForm.id
  })))
  const skillLevels = await SkillLevel.findAll({
    where: {
      course_instance_id: 1
    }
  })
  const grades = await Promise.all([
    Grade.create({
      eng_name: 'null',
      fin_name: 'null',
      swe_name: 'null',
      skill_level_id: skillLevels[0].id,
      prerequisite: null,
      order: 0,
      needed_for_grade: 0
    }),
    ...skillLevels.map((skillLevel, index) => Grade.create({
      eng_name: skillLevel.eng_name,
      fin_name: skillLevel.fin_name,
      swe_name: skillLevel.swe_name,
      skill_level_id: skillLevel.id,
      prerequisite: null,
      order: index,
      needed_for_grade: 0.5
    }))
  ])
  grades.forEach((grade, index, gradesArray) => {
    if (index === 0) return
    grade.prerequisite = gradesArray[index - 1].id
  })
  await Promise.all(grades.map(grade => grade.save()))
  await Promise.all(grades.reduce(
    (acc, grade, index) => acc.concat(categories.map(category => CategoryGrade.create({
      grade_id: grade.id,
      category_id: category.id,
      needed_for_grade: 0.5 * (index > 0)
    }))),
    []
  ))
  await Promise.all(people.reduce(
    (acc, person) => {
      const response = responses.find(res => res.person_id === person.id)
      const grade = grades[(Math.floor(Math.random() * grades.length))]
      return acc.concat(categoryQuestions.map(categoryQuestion => CategoryResponse.create({
        response_id: response.id,
        category_question_id: categoryQuestion.id,
        grade_id: grade.id,
        text: faker.hacker.phrase()
      })))
    },
    []
  ))
  console.log('data created!')
  process.exit()
}

run()
