import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

class Nav extends Component {
  state = { activeItem: 'home' }

  handleClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  render() {
    return (
      <nav>
        <Menu tabular>
          <Menu.Menu position="left">
            <Menu.Item
              header
              as={Link}
              to="/"
              name="home"
              active={this.state.activeItem === 'home'}
              onClick={this.handleClick}
            >
              DISA-työkalu
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/user"
              name="user"
              active={this.state.activeItem === 'user'}
              onClick={this.handleClick}
            >
              Oma sivu
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/course"
              name="course"
              active={this.state.activeItem === 'course'}
              onClick={this.handleClick}
            >
              Kurssi
            </Menu.Item>
            <Menu.Item
              as={Link}
              to="/selfAssesment"
              name="assessment"
              active={this.state.activeItem === 'assessment'}
              onClick={this.handleClick}
            >
              Itsearvio
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </nav>
    )
  }
}

export default withRouter(Nav)
