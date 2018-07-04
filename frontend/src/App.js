import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

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

export default withRouter(connect(null, null)(App))
