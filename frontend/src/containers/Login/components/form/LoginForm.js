import React, { Component } from 'react'
import { func, shape, number, string } from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Container, Form, Label, Input, Button, Segment } from 'semantic-ui-react'
import { Redirect } from 'react-router'
import './form.css'

import { loginAction } from '../../../../actions/actions'


export class LoginForm extends Component {
  state = {
    emptyFields: {
      username: true,
      password: true
    },
    redirect: false
  }

  login = (e) => {
    e.preventDefault()
    this.props.loginAction({
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
      return <Redirect to={this.props.redirectTo} />
    }
    return (
      <Container className="LoginForm">
        <Segment>
          {this.props.user.id ?
            <h5>{`${this.props.translate('Login.LoginForm.already_logged_in')}, ${this.props.user.name}.`}</h5> :
            <Form onSubmit={this.login}>
              <Form.Field width={16} inline>
                <Label>{this.props.translate('Login.LoginForm.username')}</Label>
                <Input className="usernameInput" name="username" type="text" onChange={this.changeField('username')} />
              </Form.Field>
              <Form.Field width={16} inline>
                <Label>{this.props.translate('Login.LoginForm.password')}</Label>
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
            </Form>}
        </Segment>
      </Container>
    )
  }
}

LoginForm.propTypes = {
  user: shape({ id: number }),
  loginAction: func.isRequired,
  redirectTo: string,
  translate: func.isRequired
}

LoginForm.defaultProps = {
  user: {},
  redirectTo: '/user'
}

const mapStateToProps = state => ({
  user: state.user
})

export default withLocalize(connect(mapStateToProps, { loginAction })(LoginForm))
