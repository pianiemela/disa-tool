import React from 'react'
import { connect } from 'react-redux'
import { Form } from 'semantic-ui-react'
import { changeTextField } from '../../../../../actions/actions'

class SelfAssesmentInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {}

    }
  }
  // Unecessary rerender
  componentDidMount() {
    const values = {}
    this.props.formData.forEach((d) => {
      values[d.type] = d.value
    })
    this.setState({ values })
  }

  handleChange = (type, value) => {
    const oldValue = this.state.values
    this.setState({ values: ({ ...oldValue, [type]: value }) })
  }
  render() {
    const descriptions = this.props.formData.filter(d => d.type.includes('instruction'))
    const names = this.props.formData.filter(d => d.type.includes('name'))

    return (
      <Form style={{ padding: '20px' }}>
        <Form.Group>
          {names.map(n => (
            <Form.Input
              key={n.id}
              label={n.displayName}
              name={n.type}
              placeholder={n.name}
              // To prevent null in state, which prompts warning to dev console
              value={this.state.values[n.type] ? this.state.values[n.type] : ''}
              onChange={e => this.handleChange(n.type, e.target.value)}
              onBlur={() => this.props.dispatchTextFieldChange(n.type, this.state.values[n.type])}
            />
          ))}
        </Form.Group>

        {
          descriptions.map(d => (
            <Form.Field key={d.id}>
              <Form.TextArea
                label={d.displayName}
                name={d.type}
                placeholder={d.name}
                value={this.state.values[d.type] ? this.state.values[d.type] : ''}
                onChange={(e) => this.handleChange(d.type, e.target.value)}
                onBlur={() => this.props.dispatchTextFieldChange(d.type, this.state.values[d.type])}


              />
            </Form.Field>
          ))
        }
      </Form >
    )
  }
}
const mapDispatchToProps = dispatch => ({
  dispatchTextFieldChange: (type, value) =>
    dispatch(changeTextField(type, value))
})

export default connect(null, mapDispatchToProps)(SelfAssesmentInfo)

