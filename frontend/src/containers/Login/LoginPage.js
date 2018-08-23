import React from 'react'
import PropTypes from 'prop-types'

import LoginForm from './components/form/LoginForm'

const LoginPage = props => (
  <div className="LoginPage">
    <h1>Kirjaudu sisään</h1>
    <LoginForm redirectTo={props.redirectTo} />
  </div>
)

LoginPage.propTypes = {
  redirectTo: PropTypes.string
}

LoginPage.defaultProps = {
  redirectTo: null
}

export default LoginPage
