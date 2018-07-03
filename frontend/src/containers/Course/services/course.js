const hardCodedTasks = [
  {
    id: 1,
    name: 'laske matriisit yhteen',
    description: 'Tässä tehtävässä lasketaan matriiseja yhteen ja sen sellaista',
    info: 'http://www.wolframalpha.com',
    maxPoints: 1,
    objectives: [0, 1, 2]
  },
  {
    id: 2,
    name: 'laske vektorien summa',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 2,
    objectives: [10, 12, 13]
  },
  {
    id: 3,
    name: 'piirrä kuva',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 4,
    objectives: [5, 6, 7]
  },
  {
    id: 4,
    name: 'piirrä monimutkainen kuva',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 1,
    objectives: [8]
  },
  {
    id: 5,
    name: 'laske vaikea lasku',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 2,
    objectives: [3, 4]
  },
  {
    id: 6,
    name: 'todista väite',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 4,
    objectives: [7, 8, 9]
  },
  {
    id: 7,
    name: 'laske käytännön ongelma',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 3,
    objectives: [1, 2, 3]
  },
  {
    id: 8,
    name: 'juttele kaverin kanssa',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 4,
    objectives: [4, 5, 6, 10, 11, 12]
  },
  {
    id: 9,
    name: 'pyöräile Hankoon',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 1,
    objectives: [0, 5, 8]
  },
  {
    id: 10,
    name: 'laske vektorien pistetulo',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 1,
    objectives: [0, 4, 13]
  },
  {
    id: 11,
    name: 'muodosta käänteismatriisi',
    description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
    info: 'http://www.wolframalpha.com',
    maxPoints: 1,
    objectives: [0, 2, 11]
  }
]

const hardCodedObjectives = [
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

const hardCodedCategories = {
  matriisit: { 
    1: ['matriisien yhteenlasku', 'matriisien muodostus'],
    2: ['matriisien kertolasku', 'matriisien pyörittely'],
    3: ['matriiseilla päteminen', 'matriisien heiluttelu', 'matriisien superlasku', 'supreme matriisimestari']
   },
  'vektorit ja muut': {
    1: ['vektorien yhteenlasku', 'vektorien muodostus'],
    2: ['vektorien kertolasku', 'pyörittely', 'vektorien 3D piirtely'],
    3: ['vektorien äärimmäinen heiluttelu']
  }
}

const hardCodedLevels = [
  {
    name: 'taso1',
    id: 1
  },
  {
     name: 'taso2',
     id: 2
  },
  {
     name: 'taso3',
    id: 3
  }
]

export const getCourseData = data => {
  const response = {
    message: '<getTasksForCourseSuccess>',
    data: {
      courseId: data.courseId,
      tasks: [...hardCodedTasks],
      objectives: [...hardCodedObjectives],
      categories: { ...hardCodedCategories },
      levels: [...hardCodedLevels]
    }
  }
  const action = {
    type: 'COURSE_GET_DATA',
    response
  }
  return new Promise((resolve, reject) => {
    setTimeout(resolve, 100, action)
  })
}