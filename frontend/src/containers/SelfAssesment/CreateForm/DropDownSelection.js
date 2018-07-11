import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Form, Button } from 'semantic-ui-react'
const DropdownSelection = (props) => {
  const { onChange, options, placeholder, modify, label, submit } = props
  return (
    <Form style={{ paddingTop: '20px', paddingBottom: '20px' }}>
      <Form.Field>
        <Dropdown
          selection
          placeholder={placeholder}
          onChange={onChange}
          options={options}
        />
      </Form.Field>

      {modify ?
        <Form.Field style={{ paddingTop: '5px' }}>
          <Button
            size="tiny"
            onClick={submit}
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
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.number
  }))
}

DropdownSelection.defaultProps = {
  options: [],
  onChange: () => void (0)
}

export default DropdownSelection
