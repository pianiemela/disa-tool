import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import { getUserAction } from './actions/actions'
import Nav from './containers/Nav/navbar'
import Main from './containers/Main/main'

class App extends Component {
  componentDidMount() {
    this.props.dispatchGetUser()
    console.log(this.props.user)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.user) {
      this.props.dispatchGetUser().then(() => console.log(this.props.user))
    }
  }

  render() {
    return (
      <div>
        <Nav />
        <Main />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchGetUser: () =>
    dispatch(getUserAction())
})

const mapStateToProps = state => ({
  user: state.user
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
