import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux'
import * as Sentry from '@sentry/browser'

import { getUserAction, shibbolethLoginAction } from './actions/actions'
import Nav from './containers/Nav/navbar'
import Main from './containers/Main/main'
import LocalizeWrapper from './containers/Localize/LocalizeWrapper'

class App extends Component {
  componentDidMount() {
    this.props.getUserAction()
    if (process.env.NODE_ENV !== 'development') this.props.shibbolethLoginAction()
  }

  componentDidCatch(err) {
    Sentry.configureScope((context) => {
      context.setUser({ id: this.props.user.id, username: this.props.user.name })
    })
    Sentry.captureException(err)
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
  user: PropTypes.shape({ name: PropTypes.string, id: PropTypes.number }).isRequired,
  getUserAction: PropTypes.func.isRequired,
  shibbolethLoginAction: PropTypes.func.isRequired
}

const mapStateToProps = ({ user }) => ({ user })

export default withRouter(connect(mapStateToProps, { shibbolethLoginAction, getUserAction })(App))
