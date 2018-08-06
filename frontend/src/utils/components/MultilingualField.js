import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Segment, Label, Input } from 'semantic-ui-react'

class MultilingualField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      values: this.props.values
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.values !== this.props.values) {
      this.setState({
        values: newProps.values
      })
    }
  }

  changeValue = key => e => this.setState({
    values: {
      ...this.state.values,
      [key]: e.target.value
    }
  })

  render() {
    return (
      <Form.Field className="MultilingualField">
        <Label style={{ fontSize: '18px' }}>{this.props.fieldDisplay}</Label>
        <Segment style={{ marginTop: '0px' }}>
          <Form.Field>
            <Label>english</Label>
            <Input
              name={`eng_${this.props.field}`}
              type="text"
              fluid
              value={this.state.values.eng}
              onChange={this.changeValue('eng')}
            />
          </Form.Field>
          <Form.Field>
            <Label>suomi</Label>
            <Input
              name={`fin_${this.props.field}`}
              type="text"
              fluid
              value={this.state.values.fin}
              onChange={this.changeValue('fin')}
            />
          </Form.Field>
          <Form.Field>
            <Label>svenska</Label>
            <Input
              name={`swe_${this.props.field}`}
              type="text"
              fluid
              value={this.state.values.swe}
              onChange={this.changeValue('swe')}
            />
          </Form.Field>
        </Segment>
      </Form.Field>
    )
  }
}

MultilingualField.propTypes = {
  field: PropTypes.string.isRequired,
  fieldDisplay: PropTypes.string.isRequired,
  values: PropTypes.shape({
    eng: PropTypes.string,
    fin: PropTypes.string,
    swe: PropTypes.string
  })
}

MultilingualField.defaultProps = {
  values: {
    eng: '',
    fin: '',
    swe: ''
  }
}

export default MultilingualField
