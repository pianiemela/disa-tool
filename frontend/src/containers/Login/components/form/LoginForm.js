import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Label, Input, Button, Segment } from 'semantic-ui-react'
import { Redirect } from 'react-router'
import './form.css'

import { login } from '../../services/login'


export class LoginForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
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
      .then(() => this.setState({ redirect: true }))
      .catch(() => {})
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
    if (this.state.redirect) {
      return <Redirect to="/user" />
    }
    return (
      <div className="LoginForm">
        <Segment className="formContainer">
          <Form className="blockForm" onSubmit={this.login}>
            <Form.Field className="field" width={16} inline>
              <Label>käyttäjänimi</Label>
              <Input className="usernameInput" name="username" type="text" onChange={this.changeField('username')} />
            </Form.Field>
            <Form.Field className="field" width={16} inline>
              <Label>salasana</Label>
              <Input className="passwordInput" name="password" type="password" onChange={this.changeField('password')} />
            </Form.Field>
            <Button
              className="submitButton"
              type="submit"
              disabled={!Object.values(this.state.emptyFields).every(value => !value)}
              color={!Object.values(this.state.emptyFields).every(value => !value) ? undefined : 'green'}
            >
              Login
            </Button>
          </Form>
        </Segment>
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
