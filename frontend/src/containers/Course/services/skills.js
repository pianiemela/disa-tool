const hardCodedSkills = [
  {
    name: 'matriisien yhteenlasku',
    id: 1
  },
  {
    name: 'matriisien muodostus',
    id: 2
  },
  {
    name: 'matriisien kertolasku',
    id: 3
  },
  {
    name: 'matriisien pyörittely',
    id: 4
  },
  {
    name: 'matriiseilla päteminen',
    id: 5
  },
  {
    name: 'matriisien heiluttelu',
    id: 6
  },
  {
    name: 'matriisien superlasku',
    id: 7
  },
  {
    name: 'supreme matriisimestari',
    id: 8
  },
  {
    name: 'vektorien yhteenlasku',
    id: 9
  },
  {
    name: 'vektorien muodostus',
    id: 10
  },
  {
    name: 'vektorien kertolasku',
    id: 11
  },
  {
    name: 'pyörittely',
    id: 12
  },
  {
    name: 'vektorien 3D piirtely',
    id: 13
  },
  {
    name: 'vektorien äärimmäinen heiluttelu',
    id: 14
  }
]

export const getSkillsForCourse = data => {
  const response = {
    message: '<getSkillsForCourseSuccess>',
    data: {
      courseId: data.courseId,
      skills: [...hardCodedSkills]
    }
  }
  const action = {
    type: 'SKILL_GET_FOR_COURSE',
    response
  }
  return new Promise((resolve, reject) => {
    console.log(action)
    setTimeout(resolve, 100, action)
  })
}