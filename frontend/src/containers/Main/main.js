import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter, Switch, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import HomePage from '../Home/HomePage'
import LoginPage from '../Login/LoginPage'
import MatrixPage from '../Course/MatrixPage'
import CoursePage from '../Course/CoursePage'
import SelfAssesmentPage from '../SelfAssesment/SelfAssesmentPage'
import SelfAssesmentForm from '../SelfAssesment/Userform/SelfAssesmentForm'
import AdminPage from '../Admin/AdminPage'
import UserPage from '../User/UserPage'
import CourseListPage from '../CourseList/CourseListPage'
import CreateCoursePage from '../CreateCourse/CreateCoursePage'
import UploadResponsesPage from '../TaskResponses/UploadResponsesPage'
import SelfAssesmentListPage from '../SelfAssesmentList/SelfAssesmentListPage'

class Main extends PureComponent {
  componentWillReceiveProps(newProps) {
    if (this.props.toast !== newProps.toast) {
      toast(newProps.toast.message, newProps.toast.options)
    }
  }

  render() {
    return (
      <main>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar
        />
        <Switch>
          <Route exact path="/selfassesment/edit/:selfAssesmentId" render={({ match }) => <SelfAssesmentForm edit match={match} />} />
          <Route exact path="/selfassesment/create/:courseInstanceId/:type" render={({ match }) => <SelfAssesmentForm edit new match={match} />} />
          <Route exact path="/selfassesment/response/:selfAssesmentId" render={({ match }) => <SelfAssesmentForm edit={false} match={match} />} />
          <Route exact path="/selfassesment/list/:selfAssesmentId" render={({ match }) => <SelfAssesmentListPage selfAssesmentId={Number(match.params.selfAssesmentId)} />} />
          <Route exact path="/selfassesment/:courseId" component={SelfAssesmentPage} />
          <Route path="/selfassesment" component={SelfAssesmentPage} />
          <Route exact path="/user/course/:courseId" component={UserPage} />
          <Route exact path="/user" component={UserPage} />
          <Route path="/course/matrix/:id" component={MatrixPage} />
          <Route path="/course/:id" component={CoursePage} />
          <Route path="/tasks-responses/upload/:courseId" component={UploadResponsesPage} />
          <Route exact path="/courses" component={CourseListPage} />
          <Route exact path="/courses/create" component={CreateCoursePage} />
          <Route exact path="/login" component={LoginPage} />
          <Route path="/admin" component={AdminPage} />
          <Route component={HomePage} />
        </Switch>
      </main>
    )
  }
}

Main.propTypes = {
  toast: PropTypes.shape({
    message: PropTypes.string,
    options: PropTypes.object
  }).isRequired
}

const mapStateToProps = state => ({
  toast: state.toast
})

export default withRouter(connect(mapStateToProps, null)(Main))
