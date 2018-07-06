import React from 'react'
import { Icon } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const UpOrDownToggle = ({ id, handleChange }) => (
  (
    <div>
      <Icon color="red" name="arrow circle down" size="big" onClick={() => handleChange(id, 'changeOrder', 'down')} />
      <Icon color="green" name="arrow circle up" size="big" onClick={() => handleChange(id, 'changeOrder', 'up')} />
    </div>
  )
)


export default UpOrDownToggle

UpOrDownToggle.propTypes = {
  id: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
}
