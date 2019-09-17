import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Form, Segment, Label, Input, Button } from 'semantic-ui-react'

class MultilingualField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      multilingual: false,
      values: this.props.values
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.values !== this.props.values) {
      this.setState({
        values: newProps.values,
        multilingual: (
          newProps.values.eng !== newProps.values.fin || newProps.values.fin !== newProps.values.swe
        )
      })
    }
  }

  changeValue = key => (key === 'all' ? (
    e => this.setState({
      values: {
        eng: e.target.value,
        fin: e.target.value,
        swe: e.target.value
      }
    })
  ) : (
    e => this.setState({
      values: {
        ...this.state.values,
        [key]: e.target.value
      }
    })
  ))

  allValue = () => {
    if (this.state.values.eng !== '') {
      return this.state.values.eng
    }
    if (this.state.values.fin !== '') {
      return this.state.values.fin
    }
    return this.state.values.swe
  }

  translate = id => this.props.translate(`utils.components.MultilingualField.${id}`)

  render() {
    const { required } = this.props
    return (
      <Form.Field className="MultilingualField">
        <div style={{ display: 'flex' }}>
          <div style={{ flexGrow: 1 }}>
            <Label style={{ fontSize: '18px' }}>{this.props.fieldDisplay}</Label>
          </div>
          <Button.Group>
            <Button
              type="button"
              toggle
              active={!this.state.multilingual}
              onClick={() => this.setState({ multilingual: false })}
            >
              {this.translate('monolingual')}
            </Button>
            <Button.Or text={this.translate('or')} />
            <Button
              type="button"
              toggle
              active={this.state.multilingual}
              onClick={() => this.setState({ multilingual: true })}
            >
              {this.translate('multilingual')}
            </Button>
          </Button.Group>
        </div>
        {!this.state.multilingual ? (
          <Input
            name="all"
            type="text"
            fluid
            value={this.allValue()}
            onChange={this.changeValue('all')}
            required={required}
          />
        ) : (
          null
        )}
        <Segment style={{ marginTop: '0px', display: this.state.multilingual ? 'block' : 'none' }}>
          <Form.Field>
            <Label>english</Label>
            <Input
              name={`eng_${this.props.field}`}
              type="text"
              fluid
              value={this.state.values.eng}
              onChange={this.changeValue('eng')}
              required={this.state.multilingual && required}
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
              required={this.state.multilingual && required}
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
              required={this.state.multilingual && required}
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
  }),
  translate: PropTypes.func.isRequired,
  required: PropTypes.bool
}

MultilingualField.defaultProps = {
  values: {
    eng: '',
    fin: '',
    swe: ''
  },
  required: false
}

export default withLocalize(MultilingualField)
