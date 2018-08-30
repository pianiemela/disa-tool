import React from 'react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

export const Navbar = (props) => {
  const translate = id => props.translate(`Course.navbar.Navbar.${id}`)
  return (
    <nav className="Navbar">
      <Menu pointing>
        <Menu.Item
          className="tasksLink"
          as={Link}
          to={`${props.matchUrl}/tasks`}
          active={props.pathname.includes('tasks')}
        >
          <span>{translate('tasks')}</span>
        </Menu.Item>
        <Menu.Item
          className="matrixLink"
          as={Link}
          to={`${props.matchUrl}/matrix`}
          active={props.pathname.includes('matrix')}
        >
          <span>{translate('matrix')}</span>
        </Menu.Item>
        <Menu.Item
          className="typesLink"
          as={Link}
          to={`${props.matchUrl}/types`}
          active={props.pathname.includes('types')}
        >
          <span>{translate('types')}</span>
        </Menu.Item>
        <Menu.Item
          className="gradesLink"
          as={Link}
          to={`${props.matchUrl}/grades`}
          active={props.pathname.includes('grades')}
        >
          <span>{translate('grades')}</span>
        </Menu.Item>
      </Menu>
    </nav>
  )
}

Navbar.propTypes = {
  matchUrl: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  translate: PropTypes.func.isRequired
}

export default withLocalize(Navbar)
