const hardCodedTasks = [
  {
    id: 1,
    name: 'laske matriisit yhteen',
    description: 'Tässä tehtävässä lasketaan matriiseja yhteen ja sen sellaista',
    info: 'http://www.wolframalpha.com',
    maxmaxPoints: 1,
    skills: [0, 1, 2]
  },
  {
    id: 2,
    name: 'laske vektorien summa',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 2,
    skills: [10, 12, 13]
  },
  {
    id: 3,
    name: 'piirrä kuva',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 4,
    skills: [5, 6, 7]
  },
  {
    id: 4,
    name: 'piirrä monimutkainen kuva',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 1,
    skills: [8]
  },
  {
    id: 5,
    name: 'laske vaikea lasku',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 2,
    skills: [3, 4]
  },
  {
    id: 6,
    name: 'todista väite',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 4,
    skills: [7, 8, 9]
  },
  {
    id: 7,
    name: 'laske käytännön ongelma',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 3,
    skills: [1, 2, 3]
  },
  {
    id: 8,
    name: 'juttele kaverin kanssa',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 4,
    skills: [4, 5, 6, 10, 11, 12]
  },
  {
    id: 9,
    name: 'pyöräile Hankoon',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 1,
    skills: [0, 5, 8]
  },
  {
    id: 10,
    name: 'laske vektorien pistetulo',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 1,
    skills: [0, 4, 13]
  },
  {
    id: 11,
    name: 'muodosta käänteismatriisi',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 1,
    skills: [0, 2, 11]
  }
]

export const getTasksForCourse = data => {
  const response = {
    message: '<getTasksForCourseSuccess>',
    data: {
      courseId: data.courseId,
      tasks: [...hardCodedTasks]
    }
  }
  const action = {
    type: 'TASK_GET_FOR_COURSE',
    response
  }
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, action)
  })
}

export const addSkillToTask = data => new Promise((resolve, reject) => {
  const response = {
    message: '<addSkillToTaskSuccess>',
    data
  }
  setTimeout(resolve, 100, response)
})