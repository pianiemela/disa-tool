import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const Navbar = props => (
  <nav className="Navbar">
    <Menu pointing>
      <Menu.Item
        as={Link}
        to={`${props.matchUrl}/matrix`}
        className="matrixLink"
        active={props.pathname.includes('matrix')}
      />
      <Menu.Item
        as={Link}
        to={`${props.matchUrl}/types`}
        className="typesLink"
        active={props.pathname.includes('types')}
      />
      <Menu.Item
        as={Link}
        to={`${props.matchUrl}/tasks`}
        className="tasksLink"
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
