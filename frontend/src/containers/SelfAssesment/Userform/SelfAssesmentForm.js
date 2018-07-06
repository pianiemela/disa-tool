import React from 'react'
import PropTypes from 'prop-types'
import { Form } from 'semantic-ui-react'
import ObjectiveQuestionModule from './ObjectiveQuestionModule'
import CategoryQuestionModule from './CategoryQuestionModule'

class SelfAssesmentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  renderEditableForm = () => {
    if (this.props.created) {
      const { createdForm, edit, handleFormChange } = this.props
      console.log(this.props)

      if (createdForm.type === 'objectives') {
        return (
          <div>
            <h2>{createdForm.name} tavoitelomake</h2>
            <Form>
              {createdForm.questionModules.map(questionModules =>
                <ObjectiveQuestionModule key={questionModules.id} data={questionModules} edit={edit} handleFormChange={handleFormChange} />)
              }
            </Form>
          </div>)
      }
      return (
        <div>
          <h2>{createdForm.name} kategorialomake</h2>
          <Form>
            {createdForm.questionModules.map(questionModules =>
              <CategoryQuestionModule key={questionModules.id} data={questionModules} edit={edit} handleFormChange={handleFormChange} />)
            }
          </Form>
        </div>)
    }
    return null
  }
  render() {
    return (
      <div>
        <p>olet nyt renderöinyt formin!</p>
        {this.renderEditableForm()}
      </div >
    )
  }
}

SelfAssesmentForm.defaultProps = {
  justCreated: false,
  createdForm: {}
}

SelfAssesmentForm.propTypes = {
  justCreated: PropTypes.bool,
  createdForm: PropTypes.shape()
}

export default SelfAssesmentForm
