import React, { PureComponent } from 'react'
import { shape, string } from 'prop-types'
import { Redirect, Route, withRouter } from 'react-router-dom'

import { saveToken } from '../../../utils/utils'

const parseToken = (search) => {
  const tokenParam = search
    .split(/(\?|&)/)
    .find(str => str.substring(0, 6) === 'token=')
  if (!tokenParam) { return null }
  return tokenParam.substring(6, tokenParam.length)
}

class HakaAuthentication extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      redirect: null
    }
  }

  componentDidMount() {
    const token = parseToken(this.props.location.search)
    if (!token) { return }
    saveToken(token)
    this.setState({ redirect: '/' })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
    return (
      <Route
        path="/login/haka"
        render={() => <a href="/api/saml/">HAKA</a>}
      />
    )
  }
}

HakaAuthentication.propTypes = {
  location: shape({
    search: string.isRequired
  }).isRequired
}

export default withRouter(HakaAuthentication)
