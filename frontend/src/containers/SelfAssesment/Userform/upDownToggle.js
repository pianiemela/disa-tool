import React from 'react'
import { Icon } from 'semantic-ui-react'

const UpOrDownToggle = ({ id, handleChange }) => {
  return (
    <div>
      <Icon color="red" name="arrow circle down" size="big" onClick={() => handleChange(id, 'changeOrder', 'down')} />
      <Icon color="green" name="arrow circle up" size="big" onClick={() => handleChange(id, 'changeOrder', 'up')} />
    </div>
  )
}

export default UpOrDownToggle