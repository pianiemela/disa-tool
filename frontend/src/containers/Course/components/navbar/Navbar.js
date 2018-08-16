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
        active={props.pathname.includes('tasks')}
      >
        <span>Tehtävät</span>
      </Menu.Item>
      <Menu.Item
        className="matrixLink"
        as={Link}
        to={`${props.matchUrl}/matrix`}
        active={props.pathname.includes('matrix')}
      >
        <span>Matriisi</span>
      </Menu.Item>
      <Menu.Item
        className="typesLink"
        as={Link}
        to={`${props.matchUrl}/types`}
        active={props.pathname.includes('types')}
      >
        <span>Tyypit</span>
      </Menu.Item>
      <Menu.Item
        className="gradesLink"
        as={Link}
        to={`${props.matchUrl}/grades`}
        active={props.pathname.includes('grades')}
      >
        <span>Arvosteluperusteet</span>
      </Menu.Item>
    </Menu>
  </nav>
)

Navbar.propTypes = {
  matchUrl: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired
}

export default Navbar
