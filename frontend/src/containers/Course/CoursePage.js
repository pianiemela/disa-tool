import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getCourseData } from './services/course'

import Matrix from './components/Matrix'
import Tasklist from './components/tasks/Tasklist'

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
            <Matrix />
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