import React from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import LoginPage from '../Login/LoginPage'
import CoursePage from '../Course/CoursePage'
import SelfAssesmentPage from '../SelfAssesment/SelfAssesmentPage'
import SelfAssesmentForm from '../SelfAssesment/Userform/SelfAssesmentForm'
import UserPage from '../User/UserPage'
import CourseList from '../Course/CourseList'

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/selfassesment/:courseId" component={SelfAssesmentPage} />
      <Route exact path="/selfassesment/edit/:selfAssesmentId" component={({ match }) => <SelfAssesmentForm edit match={match} />} />
      <Route path="/selfassesment" component={SelfAssesmentPage} />
      <Route exact path="/user/course/:courseId" component={UserPage} />
      <Route exact path="/user" component={UserPage} />
      <Route path="/course/:id" component={CoursePage} />
      <Route exact path="/courses" component={CourseList} />
      <Route component={LoginPage} />
    </Switch>
  </main>
)

export default withRouter(Main)
