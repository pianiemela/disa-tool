import React from 'react'
import { Form } from 'semantic-ui-react'
import ObjectiveQuestionModule from './ObjectiveQuestionModule'
import CategoryQuestionModule from './CategoryQuestionModule'

class SelfAssesmentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {
    console.log(this.props)
  }

  renderEditableForm = () => {
    if (this.props.justCreated) {
      const { createdForm } = this.props

      if (createdForm.type === 'objectives') {
        return (
          <div>
            <h2>{createdForm.fin_name} tavoitelomake</h2>
            <Form>
              {createdForm.questionModules.map(questionModules =>
                <ObjectiveQuestionModule data={questionModules} edit={true} />)
              }
            </Form>
          </div>)
      }
      return (
        <div>
          <h2>{createdForm.fin_name} kategorialomake</h2>
          <Form>
            {createdForm.questionModules.map(questionModules =>
              <CategoryQuestionModule data={questionModules} edit={true} />)
            }
          </Form>
        </div>)
    }
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

export default SelfAssesmentForm
