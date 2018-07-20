import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { Loader } from 'semantic-ui-react'
import asyncAction from '../../utils/asyncAction'

import { getCourseData } from './services/course'

import EditMatrixPage from '../EditMatrix/EditMatrixPage'
import EditTypesPage from '../EditTypes/EditTypesPage'
import EditTasksPage from '../EditTasks/EditTasksPage'
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
          <Route path={`${this.props.match.url}/matrix`} component={this.props.EditMatrixPage} />
          <Route path={`${this.props.match.url}/types`} component={this.props.EditTypesPage} />
          <Route path={`${this.props.match.url}/tasks`} component={this.props.EditTasksPage} />
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
  EditMatrixPage: PropTypes.func.isRequired,
  EditTypesPage: PropTypes.func.isRequired,
  EditTasksPage: PropTypes.func.isRequired
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
  EditMatrixPage: (() => <EditMatrixPage courseId={Number(ownProps.match.params.id)} />),
  EditTypesPage: (() => <EditTypesPage courseId={Number(ownProps.match.params.id)} />),
  EditTasksPage: (() => <EditTasksPage courseId={Number(ownProps.match.params.id)} />),
  loading: state.course.loading
})

const mapDispatchToProps = dispatch => ({
  getCourseData: asyncAction(getCourseData, dispatch)
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CoursePage))
