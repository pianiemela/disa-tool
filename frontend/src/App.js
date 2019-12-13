import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux'
import * as Sentry from '@sentry/browser'

import { getUserAction } from './actions/actions'
import { getUser } from './api/persons'
import Nav from './containers/Nav/navbar'
import Main from './containers/Main/main'
import LocalizeWrapper from './containers/Localize/LocalizeWrapper'

class App extends Component {
  constructor(props) {
    super(props)
    this.sessionAliveInterval = null
  }

  componentDidMount() {
    this.props.getUserAction()

    // keep shibboleth session alive
    this.sessionAliveInterval = setInterval(async () => {
      try {
        await getUser()
      } catch (e) {}
    }, 60 * 1000)
  }

  componentWillUnmount() {
    if (this.sessionAliveInterval !== null) {
      clearInterval(this.sessionAliveInterval)
      this.sessionAliveInterval = null
    }
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
}

const mapStateToProps = ({ user }) => ({ user })

export default withRouter(connect(mapStateToProps, { getUserAction })(App))
