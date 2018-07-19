import React from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import LoginPage from '../Login/LoginPage'
import CoursePage from '../Course/CoursePage'
import EditMatrixPage from '../EditMatrix/EditMatrixPage'
import EditTypesPage from '../EditTypes/EditTypesPage'
import EditTasksPage from '../EditTasks/EditTasksPage'
import SelfAssesmentPage from '../SelfAssesment/SelfAssesmentPage'
import UserPage from '../User/UserPage'
import CourseList from '../Course/CourseList'

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/user" component={UserPage} />
      <Route exact path="/course/:id" render={({ match }) => <CoursePage courseId={Number(match.params.id)} />} />
      <Route exact path="/course/:id/matrix" render={({ match }) => <EditMatrixPage courseId={Number(match.params.id)} />} />
      <Route exact path="/course/:id/types" render={({ match }) => <EditTypesPage courseId={Number(match.params.id)} />} />
      <Route exact path="/course/:id/tasks" render={({ match }) => <EditTasksPage courseId={Number(match.params.id)} />} />
      <Route exact path="/selfAssesment" component={SelfAssesmentPage} />
      <Route exact path="/courses" component={CourseList} />
      <Route component={LoginPage} />
    </Switch>
  </main>
)

export default withRouter(Main)
