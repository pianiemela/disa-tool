import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

class Nav extends Component {
  render() {
    return (
      <nav>
        <Menu stackable inverted>
          <Menu.Menu position="left">
            <Menu.Item header>
              DISA-työkalu
            </Menu.Item>
            <Menu.Item name="Course" as={Link} to="/course">
              Kurssi
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </nav>
    )
  }
}

export default withRouter(Nav)