import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Dropdown } from 'semantic-ui-react'
import { func, shape, number } from 'prop-types'
import { withLocalize } from 'react-localize-redux'

import { logoutAction } from '../../actions/actions'
import { getLanguage, saveLanguage } from '../../utils/utils'

const languageOptions = [
  { key: 'fin', value: 'fin', text: 'Suomi' },
  { key: 'swe', value: 'swe', text: 'Svenska', disabled: true },
  { key: 'eng', value: 'eng', text: 'English' }
]

class Nav extends Component {
  state = {
    activeItem: 'home',
    language: 'fin'
  }

  componentDidMount = async () => {
    const language = getLanguage()
    const path = await window.location.pathname.split('/')
    if (path.length > 1 && path[1].length > 0) {
      await this.setState({ activeItem: path[1] })
    }
    if (language) {
      this.setState({ language })
    }
  }

  componentDidUpdate = async () => {
    const path = await window.location.pathname.split('/')
    const item = path[1]
    if (item && item !== this.state.activeItem) {
      await this.setState({ activeItem: item })
    }
  }

  handleClick = (e, { name }) => {
    if (name === 'logout') {
      this.props.dispatchLogout()
    }
    this.setState({ activeItem: name })
  }

  changeLanguage = async (e, { value }) => {
    await this.setState({ language: value })
    saveLanguage(this.state.language)
    this.props.setActiveLanguage(this.state.language)
  }

  render() {
    const { activeItem, language } = this.state
    return (
      <nav>
        <Menu tabular>
          <Menu.Item
            header
            as={Link}
            to="/"
            name="home"
            active={activeItem === 'home'}
            onClick={this.handleClick}
          >
            {this.props.translate('Nav.navbar.home')}
          </Menu.Item>
          {this.props.user.id ?
            <Menu.Item
              as={Link}
              to="/user"
              name="user"
              active={activeItem === 'user'}
              onClick={this.handleClick}
            >
              {this.props.translate('Nav.navbar.user')}
            </Menu.Item> : undefined}
          <Menu.Item
            as={Link}
            to="/courses"
            name="courses"
            active={activeItem === 'courses'}
            onClick={this.handleClick}
          >
            {this.props.translate('Nav.navbar.courses')}
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Dropdown
                options={languageOptions}
                value={language}
                onChange={this.changeLanguage}
              />
            </Menu.Item>
            {this.props.user.role === 'ADMIN' ?
              <Menu.Item
                as={Link}
                to="/admin"
                name={this.props.translate('Nav.navbar.admin')}
                onClick={this.handleClick}
              />
              :
              null
            }
            {this.props.user.id ?
              <Menu.Item
                as={Link}
                to="/login"
                name="logout"
                active={activeItem === 'logout'}
                onClick={this.handleClick}
              >
                {this.props.translate('Nav.navbar.logout')}
              </Menu.Item> :
              <Menu.Item
                as={Link}
                to="/login"
                name="login"
                active={activeItem === 'login'}
                onClick={this.handleClick}
              >
                {this.props.translate('Nav.navbar.login')}
              </Menu.Item>
            }
          </Menu.Menu>
        </Menu>
      </nav>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = dispatch => ({
  dispatchLogout: () =>
    dispatch(logoutAction())
})

Nav.propTypes = {
  dispatchLogout: func.isRequired,
  user: shape({ id: number }).isRequired,
  translate: func.isRequired,
  setActiveLanguage: func.isRequired
}

export default withLocalize(withRouter(connect(mapStateToProps, mapDispatchToProps)(Nav)))
