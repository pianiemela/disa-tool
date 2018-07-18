const { SelfAssessment, Person, CoursePerson, CourseInstance } = require('../database/models.js')

const addSelfAssesment = async (data, lang) => {
  const name = [`${lang}_name`, 'name']
  const instructions = [`${lang}_instructions`, 'instructions']
  const created = await SelfAssessment.create(data)
  const createWithLanAndInst = await SelfAssessment.findOne({
    attributes: ['id', name, instructions, 'structure', 'open', 'active', 'immediate_feedback', 'course_instance_id'],
    where: { id: created.id }
  })

  return createWithLanAndInst
}

const getUserSelfAssesments = async (user, lang) => {
  const name = [`${lang}_name`, 'name']
  const instructions = [`${lang}_instructions`, 'instructions']



  // const selfAssesments = await Person.findOne({
  //   where: {
  //     id: user.id
  //   },
  //   include: [
  //     {
  //       model: CourseInstance,
  //       through: {},
  //       include: [
  //         {
  //           model: SelfAssessment
  //         }
  //       ]
  //     }
  //   ]
  // })

  const data = await SelfAssessment.findAll({
    attributes: ['id', name, instructions, 'structure', 'open', 'active', 'immediate_feedback', 'course_instance_id'],
    include: [
      {
        model: CourseInstance,
        required: true,
        attributes: ['id'],
        include: [
          {
            model: Person,
            required: true,
            attributes: [],
            where: {
              id: user.id
            }
          }
        ]
      }
    ]
  })

  return data

}


module.exports = {
  addSelfAssesment,
  getUserSelfAssesments
}