import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const Navbar = props => (
  <nav>
    <Menu pointing>
      <Menu.Item
        as={Link}
        to={`${props.matchUrl}/matrix`}
        name="matrix"
        active={props.pathname.includes('matrix')}
      />
      <Menu.Item
        as={Link}
        to={`${props.matchUrl}/types`}
        name="types"
        active={props.pathname.includes('types')}
      />
      <Menu.Item
        as={Link}
        to={`${props.matchUrl}/tasks`}
        name="tasks"
        active={props.pathname.includes('tasks')}
      />
    </Menu>
  </nav>
)

Navbar.propTypes = {
  matchUrl: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired
}

export default Navbar
