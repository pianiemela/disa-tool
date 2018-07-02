import React, { Component } from 'react'
import { withRouter, Switch, Route } from 'react-router-dom'

import LoginPage from '../Login/LoginPage'
import CoursePage from '../Course/CoursePage'

class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/course" component={CoursePage} />
          <Route component={LoginPage} />
        </Switch>
      </main>
    )
  }
}

export default withRouter(Main)