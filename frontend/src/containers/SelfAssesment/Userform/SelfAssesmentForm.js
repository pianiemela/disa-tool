import React from 'react'
import PropTypes from 'prop-types'
import { Form, Grid } from 'semantic-ui-react'
import ObjectiveQuestionModule from './ObjectiveQuestionModule'
import CategoryQuestionModule from './CategoryQuestionModule'
import OpenQuestionModule from './OpenQuestionModule'

import { Card } from 'semantic-ui-react'
import './selfAssesment.css'


class SelfAssesmentForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  textArea = (label, placeholder, textFieldOn, checkbox) => (
    (
      <Grid.Column width={10}>
        <Form.TextArea
          disabled={!textFieldOn}
          label={label}
          placeholder={placeholder}
        />
        {checkbox}
      </Grid.Column>
    )
  )

  renderForm = (type, createdForm, edit, handleChange) => (
    (
      (type === 'category' ?
        <div>
          <h2>{createdForm.name} kategorialomake</h2>
          <Card fluid className="formCard">
            <Card.Content>
              <Card.Header className="cardHead">
                Kategoria-arviointi
              </Card.Header>
              <Form>
                {createdForm.questionModules.map(questionModules =>
                  (<CategoryQuestionModule
                    key={questionModules.id}
                    data={questionModules}
                    edit={edit}
                    handleChange={handleChange}
                    textArea={this.textArea}
                  />))}
              </Form>
            </Card.Content>
          </Card>

          <Card fluid>
            <Card.Content>
              <Card.Header className="cardHead">
                Avoimet kysymykset
              </Card.Header>
              <Form>
                {createdForm.openQuestions.map(openQuestion =>
                  (<OpenQuestionModule
                    key={openQuestion.id}
                    data={openQuestion}
                    edit={edit}
                    handleChange={handleChange}
                    textArea={this.textArea}
                  />))}
              </Form>
            </Card.Content>
          </Card>

          <Card fluid>
            <Card.Content>
              <Card.Header className="cardHead">
                Loppuarvio
              </Card.Header>
              <Form>
                <CategoryQuestionModule
                  key={createdForm.finalGrade.id}
                  data={createdForm.finalGrade}
                  edit={edit}
                  handleChange={handleChange}
                  textArea={this.textArea}
                  final
                />
              </Form>
            </Card.Content>
          </Card>
        </div>
        :
        <div>
          <h2>{createdForm.name} tavoitelomake</h2>
          <Form>
            {createdForm.questionModules.map(questionModules =>
              (<ObjectiveQuestionModule
                key={questionModules.id}
                data={questionModules}
                edit={edit}
                handleFormChange={handleChange}
              />))}

            {createdForm.openQuestions.map(openQuestion =>
              (<OpenQuestionModule
                key={openQuestion.id}
                data={openQuestion}
                edit={edit}
                handleChange={handleChange}
                textArea={this.textArea}
              />))}
          </Form>
        </div>
      )
    )
  )

  renderEditableForm = () => {
    if (this.props.created) {
      const { createdForm, edit, handleChange } = this.props

      if (createdForm.type === 'objectives') {
        return this.renderForm('objectives', createdForm, edit, handleChange)
      }
      return this.renderForm('category', createdForm, edit, handleChange)
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
  created: false,
  createdForm: {}
}

SelfAssesmentForm.propTypes = {
  created: PropTypes.bool,
  createdForm: PropTypes.shape(),
  edit: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default SelfAssesmentForm
