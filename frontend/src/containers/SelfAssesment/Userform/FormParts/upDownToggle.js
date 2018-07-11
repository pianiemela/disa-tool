import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const UpOrDownToggle = ({ id, handleChange }) => (
  (
    <div>
      <Popup trigger={<Icon color="red" name="arrow circle down" size="big" onClick={() => handleChange({ id, type: 'changeOrderDown' })} />} content="Siirä kategoria alemmas" />
      <Popup trigger={<Icon color="green" name="arrow circle up" size="big" onClick={() => handleChange({ id, type: 'changeOrderUp' })} />} content="Siirrä kategoria ylemmäs" />
    </div >
  )
)


export default UpOrDownToggle

UpOrDownToggle.propTypes = {
  id: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired
}
