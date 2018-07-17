const { SelfAssessment, Person, CoursePerson, CourseInstance } = require('../database/models.js')

const addSelfAssesment = async (data) => {
  const created = await SelfAssessment.create(data)
  return created
}

const getUserSelfAssesments = async (user) => {
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

  const sA = await SelfAssessment.findAll({
    attributes: { exclude: ['created_at', 'updated_at'] },
    include: [
      {
        model: CourseInstance,
        required: true,
        attributes: ['id'],
        include: [
          {
            model: Person,
            through: {},
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

  return sA

}


module.exports = {
  addSelfAssesment,
  getUserSelfAssesments
}