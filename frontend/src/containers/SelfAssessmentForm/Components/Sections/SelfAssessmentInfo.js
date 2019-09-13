import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Form, Button, Card, TextArea } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'

import Header from '../Header'
import { changeTextField } from '../../actions/selfAssesment'

class SelfAssessmentInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      values: {},
      editInstructions: false
    }
  }

  handleChange = (e, { id }) => {
    const oldValue = this.state.values
    oldValue[id] = e.target.value
    this.setState({ values: oldValue })
  }
  toggleInstructions = () => {
    const { values } = this.state
    this.props.dispatchTextFieldChange({ values, type: 'instructions' })
    this.setState({
      editInstructions: !this.state.editInstructions,
      values: {}
    })
  }

  toggleHeader = (values) => {
    this.props.dispatchTextFieldChange({ values, type: 'name' })
  }

  render() {
    const translate = (id) =>
      this.props.translate(`SelfAssessmentForm.Sections.${id}`)

    const { formData } = this.props
    const { structure } = formData
    const { formInfo } = structure
    const instructions = formInfo.filter((d) => d.type.includes('instruction'))
    const names = formInfo.filter((d) => d.type.includes('name'))
    const { values } = this.state
    const { edit } = this.props

    return (
      <Form style={{ padding: '20px' }}>
        <Form.Field>
          <Header
            name={formData.name}
            edit={edit}
            editButton
            headers={names}
            dispatchChange={this.toggleHeader}
          />
        </Form.Field>
        <Form.Field>
          <Card centered fluid>
            <Card.Content>
              <Card.Header style={{ textAlign: 'center' }}>
                {formData.instructions.header}
                {edit && (
                  <Button
                    style={{ marginLeft: '10px' }}
                    onClick={this.toggleInstructions}
                  >
                    {!this.state.editInstructions
                      ? translate('buttonEdit')
                      : translate('buttonSave')}
                  </Button>
                )}
              </Card.Header>
              {!this.state.editInstructions ? (
                <Card.Description>
                  <ReactMarkdown>{formData.instructions.value}</ReactMarkdown>
                </Card.Description>
              ) : (
                instructions.map((d) => (
                  <Form.Field key={d.id}>
                    <label>{d.prefix}</label>
                    <TextArea autoHeight id={d.id} onChange={this.handleChange}>
                      {values[d.id] ? values[d.id] : d.value}
                    </TextArea>
                  </Form.Field>
                ))
              )}
            </Card.Content>
          </Card>
        </Form.Field>
      </Form>
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

const mapDispatchToProps = (dispatch) => ({
  dispatchTextFieldChange: (type, value) =>
    dispatch(changeTextField(type, value))
})

export default withLocalize(
  connect(
    null,
    mapDispatchToProps
  )(SelfAssessmentInfo)
)
