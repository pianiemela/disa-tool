import React from 'react'
import { connect } from 'react-redux'
import { Form, Header, Button, Card, TextArea } from 'semantic-ui-react'
import { changeTextField } from '../../../actions/selfAssesment'
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

  handleChange = (id, value) => {
    const oldValue = this.state.values
    oldValue[id] = value
    this.setState({ values: oldValue })
  }
  toggleEdit = (type) => {
    const { values } = this.state
    this.props.dispatchTextFieldChange({ values })
    this.setState({ [type]: !this.state[type] })
  }

  render() {

    const editButton = toggleEdit => (
      <Button
        style={{ marginLeft: '10px' }}
        onClick={() => this.toggleEdit(toggleEdit)}
      >
        {!this.state.editHeaders ? 'Muokkaa' : 'Näytä'}
      </Button>
    )


    const descriptions = this.props.formData.filter(d => d.type.includes('instruction'))
    const names = this.props.formData.filter(d => d.type.includes('name'))
    const { values } = this.state
    const { edit } = this.props
    return (

      <Form style={{ padding: '20px' }}>
        <Form.Field>
          <Header as="h3" textAlign="center">
            {names[2].value}
            {edit ?
              editButton('editHeaders')
              :
              null
            }
          </Header>
          {!this.state.editHeaders ?
            null
            :
            <div>
              <MultiLangInput
                headers={names}
                handleChange={this.handleChange}
              />
            </div>
          }
        </Form.Field>


        <Form.Field>
          <Card centered fluid>
            <Card.Content>
              <Card.Header style={{ textAlign: 'center' }}>
                Ohjeet itsearvioon
                {edit ?
                  editButton('editDescriptions')
                  :
                  null}
              </Card.Header>
              {!this.state.editDescriptions ?
                <Card.Description>
                  <TextArea
                    autoHeight
                    value={descriptions[2].value}
                  // style={{
                  // fontFamily: 'Lato, sans-serif',
                  // color: 'black'
                  // }}
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
                      value={values[d.id] ? values[d.id] : d.value}
                      onChange={e => this.handleChange(d.id, e.target.value)}
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

