import React from 'react'
import { Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const RoleButtons = (props) => {
  const { action, id, role, roles, buttonTexts, courseInstanceId } = props
  return (
    <Button.Group>
      {roles.map(r =>
        (
          <Button
            key={id}
            onClick={role === r ? null : () => action(id, courseInstanceId, r)}
            inverted={role !== r}
            color="green"
          >
            {buttonTexts[roles.indexOf(r)]}
          </Button>
        ))}
    </Button.Group>
  )
}

RoleButtons.defaultProps = {
  courseInstanceId: null
}

RoleButtons.propTypes = {
  action: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  role: PropTypes.string.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
  buttonTexts: PropTypes.arrayOf(PropTypes.string).isRequired,
  courseInstanceId: PropTypes.number
}

export default RoleButtons
