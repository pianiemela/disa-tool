import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { LocalizeProvider } from 'react-localize-redux'

import { getUserAction } from './actions/actions'
import Nav from './containers/Nav/navbar'
import Main from './containers/Main/main'
import LocalizeWrapper from './containers/Localize/LocalizeWrapper'

class App extends Component {
  componentDidMount() {
    this.props.dispatchGetUser()
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
  dispatchGetUser: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  dispatchGetUser: () =>
    dispatch(getUserAction())
})

export default withRouter(connect(null, mapDispatchToProps)(App))
