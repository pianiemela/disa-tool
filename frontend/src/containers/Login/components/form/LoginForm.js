import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Label, Input, Button } from 'semantic-ui-react'
import './form.css'

import { login } from '../../services/login'


class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      emptyFields: {
        username: true,
        password: true
      }
    }
  }

  login = (e) => {
    e.preventDefault()
    this.props.login({
      username: e.target.username.value,
      password: e.target.password.value
    })
  }

  changeField = fieldName => (e) => {
    this.setState({
      emptyFields: {
        ...this.state.emptyFields,
        [fieldName]: e.target.value === ''
      }
    })
  }

  render() {
    return (
      <div className="LoginForm">
        <Form className="blockForm" onSubmit={this.login}>
          <Form.Field className="field" width={16} inline>
            <Label>username</Label>
            <Input className="usernameInput" name="username" type="text" onChange={this.changeField('username')} />
          </Form.Field>
          <Form.Field className="field" width={16} inline>
            <Label>password</Label>
            <Input className="passwordInput" name="password" type="password" onChange={this.changeField('password')} />
          </Form.Field>
          <Button disabled={!Object.values(this.state.emptyFields).every(value => !value)} color={!Object.values(this.state.emptyFields).every(value => !value) ? undefined : 'green'}>Login</Button>
        </Form>
      </div>
    )
  }
}

LoginForm.propTypes = {
  login: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  login: login(dispatch)
})

export default connect(null, mapDispatchToProps)(LoginForm)
