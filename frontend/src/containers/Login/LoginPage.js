import React, { Component } from 'react'
import { connect } from 'react-redux'

import { login } from './services/login'

class LoginPage extends Component {
  login = (e) => {
    e.preventDefault()
    this.props.login({
      username: e.target.username.value,
      password: e.target.password.value
    })
  }

  render() {
    return (
      <div>
        <h1>Kirjaudu sisään</h1>
        <form onSubmit={this.login}>
          <label>username</label>
          <input name="username" type="text" />
          <br />
          <label>password</label>
          <input name="password" type="password" />
          <br />
          <button>Login</button>
        </form>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  login: login(dispatch)
})

export default connect(null, mapDispatchToProps)(LoginPage)
