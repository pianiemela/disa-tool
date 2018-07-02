import React, { Component } from 'react'
import { Grid } from 'semantic-ui-react'

import Matrix from './components/Matrix'
import Tasklist from './components/tasks/Tasklist'

const courseParts = {
  matriisit: { 
    taso1: ['matriisien yhteenlasku', 'matriisien muodostus'],
    taso2: ['matriisien kertolasku', 'matriisien pyörittely'],
    taso3: ['matriiseilla päteminen', 'matriisien heiluttelu', 'matriisien superlasku', 'supreme matriisimestari']
   },
  'vektorit ja muut': {
    taso1: ['vektorien yhteenlasku', 'vektorien muodostus'],
    taso2: ['vektorien kertolasku', 'pyörittely', 'vektorien 3D piirtely'],
    taso3: ['vektorien äärimmäinen heiluttelu']
  }
}

const skills = [
  'matriisien yhteenlasku', 'matriisien muodostus',
  'matriisien kertolasku', 'matriisien pyörittely',
  'matriiseilla päteminen', 'matriisien heiluttelu', 'matriisien superlasku', 'supreme matriisimestari',
  'vektorien yhteenlasku', 'vektorien muodostus',
  'vektorien kertolasku', 'pyörittely', 'vektorien 3D piirtely',
  'vektorien äärimmäinen heiluttelu'
]

const skillLevels = ['taso1', 'taso2', 'taso3']

const assessmentForm = {
  questions: [
    {
      question: 'Oletko nyt tyytyväinen?',
      type: 'radio',
      options: [1, 2, 3, 4],
      skills: [0, 1, 2, 3, 4]
    },
    {
      question: 'Kerro vähän tarkemmin',
      type: 'open',
      // options: [],
      skills: [1, 2, 3]
    }
  ],
  instant_feedback: false
}

const tasks = [
  {
  name: 'laske matriisit yhteen',
  description: 'Tässä tehtävässä lasketaan matriiseja yhteen ja sen sellaista',
  info: 'http://www.wolframalpha.com',
  maxmaxPoints: 1,
  skills: [0, 1, 2]
},
{
  name: 'laske vektorien summa',
  description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
  info: 'http://www.wolframalpha.com',
  maxPoints: 2,
  skills: [10, 12, 13]
},
{
  name: 'piirrä kuva',
  description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
  info: 'http://www.wolframalpha.com',
  maxPoints: 4,
  skills: [5, 6, 7]
},
{
  name: 'piirrä monimutkainen kuva',
  description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
  info: 'http://www.wolframalpha.com',
  maxPoints: 1,
  skills: [8]
},
{
  name: 'laske vaikea lasku',
  description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
  info: 'http://www.wolframalpha.com',
  maxPoints: 2,
  skills: [3, 4]
},
{
  name: 'todista väite',
  description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
  info: 'http://www.wolframalpha.com',
  maxPoints: 4,
  skills: [7, 8, 9]
},
{
  name: 'laske käytännön ongelma',
  description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
  info: 'http://www.wolframalpha.com',
  maxPoints: 3,
  skills: [1, 2, 3]
},
{
  name: 'juttele kaverin kanssa',
  description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
  info: 'http://www.wolframalpha.com',
  maxPoints: 4,
  skills: [4, 5, 6, 10, 11, 12]
},
{
  name: 'pyöräile Hankoon',
  description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
  info: 'http://www.wolframalpha.com',
  maxPoints: 1,
  skills: [0, 5, 8]
},
{
  name: 'laske vektorien pistetulo',
  description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
  info: 'http://www.wolframalpha.com',
  maxPoints: 1,
  skills: [0, 4, 13]
},
{
  name: 'muodosta käänteismatriisi',
  description: 'Tämä on pitkä kuvaus tehtävästä, joka voi olla suoraan itse tehtävä, tai vain sen luonnehdintaa',
  info: 'http://www.wolframalpha.com',
  maxPoints: 1,
  skills: [0, 2, 11]
}
]

const courseTask = {
  courseInstance: 1,
  task: 1,
  available: false
}

const skill = {
  name: 'matriisien yhteenlasku',

}

class CoursePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Matrix skillLevels={skillLevels} courseParts={courseParts} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Tasklist tasks={tasks} skills={skills} />
        </Grid.Row>
      </Grid>
    )
  }
}

export default CoursePage