import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import asyncAction from '../../utils/asyncAction'
import { getCourseData, resetCourse } from './actions/course'
import EditMatrixTab from './components/matrix/EditMatrixTab'
import EditTypesTab from './components/types/EditTypesTab'
import EditTasksTab from './components/tasks/EditTasksTab'
import EditGradesTab from './components/grades/EditGradesTab'
import Navbar from './components/navbar/Navbar'
import CourseHeader from './components/header/CourseHeader'

export class CoursePage extends Component {
  componentDidMount() {
    this.props.getCourseData({
      id: this.props.match.params.id
    })
  }

  componentWillUnmount() {
    this.props.resetCourse()
  }

  render() {
    if (this.props.loading) {
      return <Loader active />
    }
    return (
      <div className="CoursePage">
        <CourseHeader />
        <Navbar matchUrl={this.props.match.url} pathname={this.props.location.pathname} />
        <Switch>
          <Route path={`${this.props.match.url}/matrix`} render={() => <EditMatrixTab courseId={this.props.match.params.id} />} />
          <Route path={`${this.props.match.url}/types`} render={() => <EditTypesTab courseId={this.props.match.params.id} />} />
          <Route path={`${this.props.match.url}/tasks`} render={() => <EditTasksTab courseId={this.props.match.params.id} />} />
          <Route path={`${this.props.match.url}/grades`} render={() => <EditGradesTab courseId={this.props.match.params.id} />} />
          <Route component={() => <Redirect to={`${this.props.match.url}/matrix`} />} />
        </Switch>
      </div>
    )
  }
}

CoursePage.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string.isRequired,
    params: PropTypes.shape({
      id: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  getCourseData: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  resetCourse: PropTypes.func.isRequired
}

const mapStateToProps = (state, ownProps) => ({
  match: {
    ...ownProps.match,
    params: {
      ...ownProps.match.params,
      id: Number(ownProps.match.params.id)
    }
  },
  location: ownProps.location,
  loading: state.course.loading
})

const mapDispatchToProps = dispatch => ({
  getCourseData: asyncAction(getCourseData, dispatch),
  resetCourse: resetCourse(dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)((
  DragDropContext(HTML5Backend)(CoursePage)
)))
