import React from 'react'
import { connect } from 'react-redux'
import { Form, Header, Button } from 'semantic-ui-react'
import { changeTextField } from '../../../../../actions/actions'
import MultiLangInput from '../MultiLangInput'

class SelfAssesmentInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {},
      editHeaders: false
    }
  }

  /* {names.map(n => (
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
))} */
  // Unecessary rerender
  componentDidMount() {
    const values = {}
    this.props.formData.forEach((d) => {
      values[d.type] = d.value
    })
    this.setState({ values })
  }

  handleChange = (id, value) => {
    this.props.dispatchTextFieldChange(id, value)
    const oldValue = this.state.values
    this.setState({ values: ({ ...oldValue, [id]: value }) })
  }
  toggleEdit = () => {
    this.setState({ editHeaders: !this.state.editHeaders })
  }
  render() {
    const descriptions = this.props.formData.filter(d => d.type.includes('instruction'))
    const names = this.props.formData.filter(d => d.type.includes('name'))

    return (

      <Form style={{ padding: '20px' }}>
        {!this.state.editHeaders ?
          <Header as="h3" textAlign="center">
            {names[1].value}
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => this.toggleEdit()}
            >
              Muokkaa
            </Button>
          </Header>
          :
          <div>
            <MultiLangInput
              headers={names}
              handleBlur={this.handleChange}
              handleChange={null}
            />
            <Button
              style={{ marginTop: '10px' }}
              onClick={() => this.toggleEdit()}
            >
              Näytä
            </Button>
          </div>
        }


        {
          descriptions.map(d => (
            <Form.Field key={d.id}>
              <Form.TextArea
                label={d.displayName}
                name={d.type}
                placeholder={d.name}
                value={this.state.values[d.id] ? this.state.values[d.id] : ''}
                onBlur={e => this.handleChange(d.id, e.target.value)}


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

