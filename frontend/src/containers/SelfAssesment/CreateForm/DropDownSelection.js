import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Form, Button } from 'semantic-ui-react'

const DropdownSelection = (props) => {
  const { options, placeholder, submitButton, label, onSubmit, handleChange } = props
  return (
    <Form style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <Form.Field>
        <Dropdown
          selection
          placeholder={placeholder}
          onChange={handleChange}
          options={options}
        />
      </Form.Field>

      {submitButton ?
        <Form.Field style={{ paddingTop: '5px' }}>
          <Button
            size="tiny"
            onClick={onSubmit}
          >  {label}
          </Button>
        </Form.Field>
        :
        null
      }
    </Form>
  )
}

DropdownSelection.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.number
  })),
  placeholder: PropTypes.string.isRequired,
  submitButton: PropTypes.bool,
  label: PropTypes.string,
  onSubmit: PropTypes.func,
  handleChange: PropTypes.func
}


DropdownSelection.defaultProps = {
  options: [],
  submitButton: false,
  label: '',
  onSubmit: null,
  handleChange: null
}

export default DropdownSelection
