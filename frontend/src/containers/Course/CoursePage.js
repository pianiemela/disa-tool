import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getCourseData } from './services/course'

import EditMatrixTab from './components/matrix/EditMatrixTab'
import EditTypesTab from './components/types/EditTypesTab'
import EditTasksTab from './components/tasks/EditTasksTab'
import Navbar from './components/navbar/Navbar'
import CourseHeader from './components/header/CourseHeader'

export class CoursePage extends Component {
  componentDidMount() {
    this.props.getCourseData({
      id: this.props.match.params.id
    })
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
          <Route path={`${this.props.match.url}/matrix`} component={this.props.EditMatrixTab} />
          <Route path={`${this.props.match.url}/types`} component={this.props.EditTypesTab} />
          <Route path={`${this.props.match.url}/tasks`} component={this.props.EditTasksTab} />
          <Route component={() => <Redirect to={`${this.props.match.url}/tasks`} />} />
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
  EditMatrixTab: PropTypes.func.isRequired,
  EditTypesTab: PropTypes.func.isRequired,
  EditTasksTab: PropTypes.func.isRequired
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
  EditMatrixTab: (() => <EditMatrixTab courseId={Number(ownProps.match.params.id)} />),
  EditTypesTab: (() => <EditTypesTab courseId={Number(ownProps.match.params.id)} />),
  EditTasksTab: (() => <EditTasksTab courseId={Number(ownProps.match.params.id)} />),
  loading: state.course.loading
})

const mapDispatchToProps = dispatch => ({
  getCourseData: asyncAction(getCourseData, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CoursePage))
