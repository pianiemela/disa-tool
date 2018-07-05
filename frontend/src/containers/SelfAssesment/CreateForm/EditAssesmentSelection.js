import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Form } from 'semantic-ui-react'

const EditAssesmentSelection = (props) => {
  const { onChange, options } = props


  return (
    <Form style={{ padding: '20px' }}>
      <Form.Field>
        <Dropdown
          placeholder="Valitse muokattava itsearviointi"
          onChange={onChange}
          options={options}
        />
      </Form.Field>
      <Form.Field>
        <Form.Button style={{ marginTop: '10px' }} size="tiny">Muokkaa</Form.Button>
      </Form.Field>
    </Form>
  )
}
EditAssesmentSelection.propTypes = {
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    value: PropTypes.number
  }))
}

EditAssesmentSelection.defaultProps = {
  options: [],
  onChange: () => void(0)
}

export default EditAssesmentSelection
