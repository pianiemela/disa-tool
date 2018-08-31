import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Form, Header, Button, Card, TextArea } from 'semantic-ui-react'
import { changeTextField } from '../../../actions/selfAssesment'
import MultiLangInput from '../MultiLangInput'

class SelfAssessmentInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {},
      editName: false,
      editInstructions: false
    }
  }

  handleChange = (id, value) => {
    const oldValue = this.state.values
    oldValue[id] = value
    this.setState({ values: oldValue })
  }
  toggleEdit = (type) => {
    const { values } = this.state
    let variable = type.slice(4)
    variable = variable.charAt(0).toLowerCase() + variable.slice(1)
    this.props.dispatchTextFieldChange({ values, type: variable })
    this.setState({ [type]: !this.state[type], values: {} })
  }

  render() {
    const translate = id => this.props.translate(`SelfAssessment.Userform.Sections.${id}`)

    const editButton = toggleEdit => (
      <Button
        style={{ marginLeft: '10px' }}
        onClick={() => this.toggleEdit(toggleEdit)}
      >
        {!this.state[toggleEdit] ? translate('buttonEdit') : translate('buttonShow')}
      </Button>
    )
    const { formData } = this.props
    const { structure } = formData
    const { formInfo } = structure
    const instructions = formInfo.filter(d => d.type.includes('instruction'))
    const names = formInfo.filter(d => d.type.includes('name'))
    const { values } = this.state
    const { edit } = this.props

    return (

      <Form style={{ padding: '20px' }}>
        <Form.Field>
          <Header as="h3" textAlign="center">
            {formData.name}
            {edit ?
              editButton('editName')
              :
              null
            }
          </Header>
          {!this.state.editName ?
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
                {formData.instructions.header}
                {edit ?
                  editButton('editInstructions')
                  :
                  null}
              </Card.Header>
              {!this.state.editInstructions ?
                <Card.Description>
                  <TextArea
                    autoHeight
                    value={formData.instructions.value}
                  >
                    {formData.instructions.value}
                  </TextArea>
                </Card.Description>
                :
                instructions.map(d => (
                  <Form.Field
                    key={d.id}
                  >
                    <label>{d.prefix}</label>
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

SelfAssessmentInfo.propTypes = {
  dispatchTextFieldChange: PropTypes.func.isRequired,
  formData: PropTypes.shape({
    structure: PropTypes.shape({
      formInfo: PropTypes.arrayOf(PropTypes.shape())
    })
  }),
  edit: PropTypes.bool.isRequired,
  translate: PropTypes.func.isRequired
}

SelfAssessmentInfo.defaultProps = {
  formData: {
    structure: {
      formInfo: []
    }
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchTextFieldChange: (type, value) =>
    dispatch(changeTextField(type, value))
})

export default withLocalize(connect(null, mapDispatchToProps)(SelfAssessmentInfo))

