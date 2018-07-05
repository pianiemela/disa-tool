import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import Nav from './containers/Nav/navbar'
import Main from './containers/Main/main'

const App = () => (
  <div>
    <Nav />
    <Main />
  </div>
)

export default withRouter(connect(null, null)(App))
