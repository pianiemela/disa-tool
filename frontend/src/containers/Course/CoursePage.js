import React, { Component } from 'react'
import { Table, List, Grid, Button } from 'semantic-ui-react'

import Task from './components/Task'
import Matrix from './components/matrix/Matrix'

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
  state = {
    selectedTasks: []
  }

  addTask = (e, data) => {
    const { selectedTasks } = this.state
    const clickedTask = data.value
    const taskIndex = selectedTasks.findIndex(task => task === clickedTask)
    if (taskIndex !== -1) {
      const newTasks = [...selectedTasks]
      newTasks.splice(taskIndex, 1)
      this.setState({ selectedTasks: newTasks })
    } else {
      this.setState({ selectedTasks: [...this.state.selectedTasks, data.value] })
    }
  }

  renderTask = (taskName) => {
    console.log(tasks)
    const task = tasks.find(t => t.name === taskName)
    console.log(task)
    const taskSkills = task.skills.map(id => skills[id])
    console.log('taskSkill', taskSkills)
    return (
      <Task task={task} taskSkills={taskSkills} />
    )
  }

  render() {
    console.log(this.state)
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Matrix skillLevels={skillLevels} courseParts={courseParts} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3}>
            <List selection>
              {tasks.map(task => (
                <List.Item as={Button} basic={this.state.selectedTasks.includes(task.name)} color="green" fluid onClick={this.addTask} value={task.name}>{task.name}</List.Item>
              ))}
            </List>
          </Grid.Column>
          {this.state.selectedTasks.map(task => this.renderTask(task))}
        </Grid.Row>
      </Grid>
    )
  }
}

export default CoursePage