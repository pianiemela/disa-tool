import React from 'react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

export const Navbar = props => (
  <nav className="Navbar">
    <Menu pointing>
      <Menu.Item
        className="tasksLink"
        as={Link}
        to={`${props.matchUrl}/tasks`}
        active={props.pathname.includes('tasks')}
      >
        <span>{props.translate('Course.navbar.Navbar.tasks')}</span>
      </Menu.Item>
      <Menu.Item
        className="matrixLink"
        as={Link}
        to={`${props.matchUrl}/matrix`}
        active={props.pathname.includes('matrix')}
      >
        <span>{props.translate('Course.navbar.Navbar.matrix')}</span>
      </Menu.Item>
      <Menu.Item
        className="typesLink"
        as={Link}
        to={`${props.matchUrl}/types`}
        active={props.pathname.includes('types')}
      >
        <span>{props.translate('Course.navbar.Navbar.types')}</span>
      </Menu.Item>
      <Menu.Item
        className="gradesLink"
        as={Link}
        to={`${props.matchUrl}/grades`}
        active={props.pathname.includes('grades')}
      >
        <span>{props.translate('Course.navbar.Navbar.grades')}</span>
      </Menu.Item>
    </Menu>
  </nav>
)

Navbar.propTypes = {
  matchUrl: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired
}

export default withLocalize(Navbar)
