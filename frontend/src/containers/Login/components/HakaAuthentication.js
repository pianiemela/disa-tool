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
    // const url = process.env.MODE === 'development' ? 'http://localhost:7000' : `${process.env.SERVICE_PROVIDER_URL}?entityID=${process.env.ENTITY_ID}&return=${process.env.LOGIN_URL}`
    const url = 'https://haka.funet.fi/shibboleth/WAYF?entityID=https://disa.cs.helsinki.fi&return=http://localhost:8080/api/saml'
    return (
      <Route
        path="/login/haka"
        render={() => <a href={url}>HAKA</a>}
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
