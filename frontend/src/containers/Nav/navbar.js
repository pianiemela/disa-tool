import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Menu, Dropdown } from 'semantic-ui-react'

import { getLanguage, saveLanguage } from '../../utils/utils'

const languageOptions = [
  { key: 'fin', value: 'fin', text: 'Suomi' },
  { key: 'swe', value: 'swe', text: 'Svenska', disabled: true },
  { key: 'eng', value: 'eng', text: 'English', disabled: true }
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

  handleClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  changeLanguage = async (e, { value }) => {
    await this.setState({ language: value })
    saveLanguage(this.state.language)
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
              DISA-työkalu
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/user"
            name="user"
            active={activeItem === 'user'}
            onClick={this.handleClick}
          >
              Oma sivu
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/selfAssesment"
            name="selfAssesment"
            active={activeItem === 'selfAssesment'}
            onClick={this.handleClick}
          >
              Itsearvio
          </Menu.Item>
          <Menu.Item
            as={Link}
            to="/courses"
            name="courses"
            active={activeItem === 'courses'}
            onClick={this.handleClick}
          >
              Kurssit
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Dropdown
                options={languageOptions}
                value={language}
                onChange={this.changeLanguage}
              />
            </Menu.Item>
            {this.props.user ?
              <Menu.Item
                as={Link}
                to="/logout"
                name="logout"
                active={activeItem === 'logout'}
                onClick={this.handleClick}
              >
                Kirjaudu ulos
              </Menu.Item> :
              <Menu.Item
                as={Link}
                to="/login"
                name="login"
                active={activeItem === 'login'}
                onClick={this.handleClick}
              >
                Kirjaudu sisään
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

export default withRouter(connect(mapStateToProps, null)(Nav))
