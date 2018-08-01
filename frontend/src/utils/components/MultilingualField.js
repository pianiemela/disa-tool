import React from 'react'
import PropTypes from 'prop-types'
import { Form, Segment, Label, Input } from 'semantic-ui-react'

const MultilingualField = props => (
  <Form.Field className="MultilingualField">
    <Label style={{ fontSize: '18px' }}>{props.fieldDisplay}</Label>
    <Segment style={{ marginTop: '0px' }}>
      <Form.Field>
        <Label>english</Label>
        <Input name={`eng_${props.field}`} type="text" fluid />
      </Form.Field>
      <Form.Field>
        <Label>suomi</Label>
        <Input name={`fin_${props.field}`} type="text" fluid />
      </Form.Field>
      <Form.Field>
        <Label>svenska</Label>
        <Input name={`swe_${props.field}`} type="text" fluid />
      </Form.Field>
    </Segment>
  </Form.Field>
)

MultilingualField.propTypes = {
  field: PropTypes.string.isRequired,
  fieldDisplay: PropTypes.string.isRequired
}

export default MultilingualField
