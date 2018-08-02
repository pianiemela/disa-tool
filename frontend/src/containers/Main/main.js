import React from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import LoginPage from '../Login/LoginPage'
import CoursePage from '../Course/CoursePage'
import SelfAssesmentPage from '../SelfAssesment/SelfAssesmentPage'
import SelfAssesmentForm from '../SelfAssesment/Userform/SelfAssesmentForm'
import UserPage from '../User/UserPage'
import CourseListPage from '../CourseList/CourseListPage'
import CreateCoursePage from '../CreateCourse/CreateCoursePage'

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/selfassesment/edit/:selfAssesmentId" component={({ match }) => <SelfAssesmentForm edit match={match} />} />
      <Route exact path="/selfassesment/create/:courseInstanceId/:type" component={({ match }) => <SelfAssesmentForm edit new match={match} />} />
      <Route exact path="/selfassesment/response/:selfAssesmentId" component={({ match }) => <SelfAssesmentForm edit={false} match={match} />} />
      <Route exact path="/selfassesment/:courseId" component={SelfAssesmentPage} />
      <Route path="/selfassesment" component={SelfAssesmentPage} />
      <Route exact path="/user/course/:courseId" component={UserPage} />
      <Route exact path="/user" component={UserPage} />
      <Route path="/course/:id" component={CoursePage} />
      <Route exact path="/courses" component={CourseListPage} />
      <Route exact path="/courses/create" component={CreateCoursePage} />
      <Route component={LoginPage} />
    </Switch>
  </main>
)

export default withRouter(Main)
