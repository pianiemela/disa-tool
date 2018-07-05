import React, { Component } from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import LoginPage from '../Login/LoginPage'
import CoursePage from '../Course/CoursePage'
import SelfAssesmentPage from '../SelfAssesment/SelfAssesmentPage'

class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/course" render={() => <CoursePage courseId={1} />} />
          <Route exact path="/selfAssesment" component={SelfAssesmentPage} />
          <Route component={LoginPage} />
        </Switch>
      </main>
    )
  }
}

export default withRouter(Main)