import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const Navbar = props => (
  <nav className="Navbar">
    <Menu pointing>
      <Menu.Item
        className="tasksLink"
        as={Link}
        to={`${props.matchUrl}/tasks`}
        name=">Tasks"
        active={props.pathname.includes('tasks')}
      />
      <Menu.Item
        className="matrixLink"
        as={Link}
        to={`${props.matchUrl}/matrix`}
        name="Matrix"
        active={props.pathname.includes('matrix')}
      />
      <Menu.Item
        className="typesLink"
        as={Link}
        to={`${props.matchUrl}/types`}
        name="Types"
        active={props.pathname.includes('types')}
      />
      <Menu.Item
        className="gradesLink"
        as={Link}
        to={`${props.matchUrl}/grades`}
        name="Grades"
        active={props.pathname.includes('grades')}
      />
    </Menu>
  </nav>
)

Navbar.propTypes = {
  matchUrl: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired
}

export default Navbar
