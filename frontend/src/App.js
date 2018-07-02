import React, { Component } from 'react'
import { Table, List, Grid, Message, Button } from 'semantic-ui-react'

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

class App extends Component {
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
      <Grid columns="equal">
        <Grid.Row>
          <Grid.Column>
            <h3>{task.name}</h3>
            <h4>{task.description}</h4>
            <p>{task.info}</p>
          </Grid.Column>
        </Grid.Row>
          {taskSkills.map(skill => (
            <Grid.Row>
              <Grid.Column textAlign="right">
                <h3>{skill}</h3>
                <input type="range" min={0} max={1} step={0.01} defaultValue={0.8} />
              </Grid.Column>
            </Grid.Row>
          ))}
      </Grid>
    )
  }

  render() {
    console.log(this.state)
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Table celled structured>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell rowSpan="2">Osio</Table.HeaderCell>
                  <Table.HeaderCell colSpan="3" textAlign="center">Taitotasot</Table.HeaderCell>
                </Table.Row>
                <Table.Row>
                  {skillLevels.map(level => (
                    <Table.HeaderCell textAlign="right">{level}</Table.HeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {Object.keys(courseParts).map(part => (
                  <Table.Row>
                    <Table.Cell>{part}</Table.Cell>
                    {skillLevels.map(level => (
                      <Table.Cell>
                        <List selection>
                          {courseParts[part][level].map(skill => (
                            <List.Item>{skill}</List.Item>
                          ))}
                        </List>
                      </Table.Cell>
                    ))}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
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

export default App
