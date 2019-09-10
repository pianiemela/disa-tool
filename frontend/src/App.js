import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux'

import { getUserAction, shibbolethLoginAction } from './actions/actions'
import Nav from './containers/Nav/navbar'
import Main from './containers/Main/main'
import LocalizeWrapper from './containers/Localize/LocalizeWrapper'

class App extends Component {
  componentDidMount() {
    this.props.getUserAction()
    if (process.env.NODE_ENV !== 'development') this.props.shibbolethLoginAction()
  }

  render() {
    return (
      <LocalizeProvider>
        <LocalizeWrapper>
          <Nav />
          <Main />
        </LocalizeWrapper>
      </LocalizeProvider>
    )
  }
}

App.propTypes = {
  getUserAction: PropTypes.func.isRequired,
  shibbolethLoginAction: PropTypes.func.isRequired
}

export default withRouter(connect(null, { shibbolethLoginAction, getUserAction })(App))
