import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Table, List, Grid, Button } from 'semantic-ui-react'

import Nav from './containers/Nav/navbar'
import Main from './containers/Main/main'

class App extends Component {

  render() {
    return (
      <div>
        <Nav />
        <Main />
      </div>
    )
  }
}

export default withRouter(App)
