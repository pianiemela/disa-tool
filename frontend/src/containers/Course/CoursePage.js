import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getCourseData } from './services/course'

import Matrix from './components/matrix/Matrix'
import Tasklist from './components/tasks/Tasklist'
import Typelist from './components/types/Typelist'

class CoursePage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: true
    }
  }

  componentWillMount() {
    this.props.getCourseData({
      courseId: this.props.courseId
    })
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Matrix editing={this.state.editing} courseId={this.props.courseId} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Typelist editing={this.state.editing} courseId={this.props.courseId} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Tasklist editing={this.state.editing} courseId={this.props.courseId} />
        </Grid.Row>
      </Grid>
    )
  }
}

CoursePage.propTypes = {
  courseId: PropTypes.number.isRequired,
  getCourseData: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps
})

const mapDispatchToProps = dispatch => ({
  getCourseData: asyncAction(getCourseData, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage)
