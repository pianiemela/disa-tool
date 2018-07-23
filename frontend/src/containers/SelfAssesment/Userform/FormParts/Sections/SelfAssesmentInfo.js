import React from 'react'
import { connect } from 'react-redux'
import { Form, Header, Button, Card, TextArea } from 'semantic-ui-react'
import { changeTextField } from '../../../../../actions/actions'
import MultiLangInput from '../MultiLangInput'

class SelfAssesmentInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {},
      editHeaders: false,
      editDescriptions: false
    }
  }

  // Unecessary rerender
  componentDidMount() {
    const values = {}
    this.props.formData.forEach((d) => {
      values[d.id] = d.value
    })
    this.setState({ values })
  }

  handleChange = (id, value) => {
    this.props.dispatchTextFieldChange(id, value)
    const oldValue = this.state.values
    this.setState({ values: ({ ...oldValue, [id]: value }) })
  }
  toggleEdit = (type) => {
    console.log(type)
    this.setState({ [type]: !this.state[type] })
  }
  handleCategoryC = (id, value) => {
    const { values } = this.state
    values[id] = value
    this.setState({ values })
  }
  render() {
    const font = "'Lato', 'sans-serif'"
    const descriptions = this.props.formData.filter(d => d.type.includes('instruction'))
    const names = this.props.formData.filter(d => d.type.includes('name'))

    return (

      <Form style={{ padding: '20px' }}>
        <Form.Field>
          <Header as="h3" textAlign="center">
            {names[2].value}
            <Button
              style={{ marginLeft: '10px' }}
              onClick={() => this.toggleEdit('editHeaders')}
            >
              {!this.state.editHeaders ? 'Muokkaa' : 'Näytä'}
            </Button>
          </Header>
          {!this.state.editHeaders ?
            null
            :
            <div>
              <MultiLangInput
                headers={names}
                handleBlur={this.handleChange}
              />
            </div>
          }
        </Form.Field>


        <Form.Field>
          <Card centered fluid>
            <Card.Content>
              <Card.Header style={{ textAlign: 'center' }}>
                Ohjeet itsearvioon
                <Button
                  style={{ marginLeft: '10px' }}
                  onClick={() => this.toggleEdit('editDescriptions')}
                >
                  {this.state.editDescriptions ? 'Näytä' : 'Muokkaa'}
                </Button>
              </Card.Header>
              {!this.state.editDescriptions ?
                <Card.Description>
                  <TextArea
                    value={descriptions[2].value}
                    style={{
                      fontFamily: 'Lato, sans-serif',
                      color: 'black'
                    }}
                  >
                    {descriptions[2].value}
                  </TextArea>
                </Card.Description>
                :
                descriptions.map(d => (
                  <Form.Field
                    key={d.id}
                  >
                    <label>{d.displayName}</label>
                    <TextArea
                      autoHeight
                      value={this.state.values[d.id]}
                      onChange={e => this.handleCategoryC(d.id, e.target.value)}
                      onBlur={e => this.handleChange(d.id, e.target.value)}
                    />
                  </Form.Field>
                ))
              }
            </Card.Content>
          </Card>
        </Form.Field>
      </Form >
    )
  }
}
const mapDispatchToProps = dispatch => ({
  dispatchTextFieldChange: (type, value) =>
    dispatch(changeTextField(type, value))
})

export default connect(null, mapDispatchToProps)(SelfAssesmentInfo)

