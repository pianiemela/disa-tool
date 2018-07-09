import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Grid, Loader } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getCourseData } from './services/course'

import Matrix from './components/matrix/Matrix'
import Tasklist from './components/tasks/Tasklist'
import Typelist from './components/types/Typelist'
import CourseHeader from './components/header/CourseHeader'

export class CoursePage extends Component {
  componentWillMount() {
    this.props.getCourseData({
      courseId: this.props.courseId
    })
  }

  render() {
    if (this.props.loading) {
      return <Loader active />
    }
    return (
      <div className="CoursePage">
        <Grid>
          <Grid.Row>
            <CourseHeader editing={this.props.editing} courseName={this.props.course.name} />
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Matrix editing={this.props.editing} courseId={this.props.course.id} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Typelist editing={this.props.editing} courseId={this.props.course.id} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Tasklist editing={this.props.editing} courseId={this.props.course.id} />
          </Grid.Row>
          <Grid.Row>
            <div />
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

CoursePage.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string
  }).isRequired,
  getCourseData: PropTypes.func.isRequired,
  editing: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  courseId: PropTypes.number.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  course: state.course.course,
  editing: state.course.editing,
  loading: state.course.loading
})

const mapDispatchToProps = dispatch => ({
  getCourseData: asyncAction(getCourseData, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(CoursePage)
