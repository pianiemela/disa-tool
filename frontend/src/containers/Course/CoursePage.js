import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getCourseData } from './services/course'

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
      editing: false
    }
  }

  componentWillMount() {
    this.props.getCourseData({
      courseId: 1
    })
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
          <Tasklist editing={this.state.editing} />
        </Grid.Row>
      </Grid>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCourseData: asyncAction(getCourseData, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(CoursePage)