import React from 'react'
import { Form, Grid, Card } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import ObjectiveQuestionModule from './FormParts/QuestionModules/ObjectiveQuestionModule'
import CategoryQuestionModule from './FormParts/QuestionModules/CategoryQuestionModule'
import OpenQuestionModule from './FormParts/QuestionModules/OpenQuestionModule'
import AddOpenQuestion from './FormParts/addOpenQuestion'

import './selfAssesment.css'
import SelfAssesmentSection from './FormParts/Sections/SelfAssesmentSection';

const SelfAssesmentForm = (props) => {
  const textArea = (label, placeholder, textFieldOn, checkbox) => (
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

  const editForm = (type, formData, edit, handleChange) => (
    (
      (type === 'category' ?
        <div>
          <h2>{formData.name} kategorialomake</h2>

          <SelfAssesmentSection
            header="Kategoriaosio"
            formData={formData.questionModules}
            edit={edit}
            handleChange={handleChange}
            textArea={textArea}
            QuestionModule={CategoryQuestionModule}
          />

          <SelfAssesmentSection
            header="Avoimet kysymykset"
            formData={formData.openQuestions}
            edit={edit}
            handleChange={handleChange}
            textArea={textArea}
            QuestionModule={OpenQuestionModule}
            question
          />

          <Card fluid color="red" className="formCard">
            <Card.Content>
              <Card.Header className="cardHead">
                Loppuarvio
              </Card.Header>
              <Form>
                <CategoryQuestionModule
                  key={formData.finalGrade.id}
                  data={formData.finalGrade}
                  edit={edit}
                  handleChange={handleChange}
                  textArea={textArea}
                  final
                />
              </Form>
            </Card.Content>
          </Card>
        </div >
        :
        <div>
          <h2>{formData.name} tavoitelomake</h2>
          <Form>
            {formData.questionModules.map(questionModules =>
              (<ObjectiveQuestionModule
                key={questionModules.id}
                data={questionModules}
                edit={edit}
                handleFormChange={handleChange}
              />))}

            {formData.openQuestions.map(openQuestion =>
              (<OpenQuestionModule
                key={openQuestion.id}
                data={openQuestion}
                edit={edit}
                handleChange={handleChange}
                textArea={textArea}
              />))}
          </Form>
        </div>
      )
    )
  )

  const renderEditableForm = () => {
    console.log(props)
    if (props.edit) {
      const { formData, edit, handleChange } = props
      return editForm(formData.type, formData, edit, handleChange)
    }
    return null
  }

  return (
    <div>
      <p>olet nyt renderöinyt formin!</p>
      {renderEditableForm()}
    </div >
  )
}


SelfAssesmentForm.defaultProps = {
  formData: {}
}

SelfAssesmentForm.propTypes = {
  formData: PropTypes.shape(),
  edit: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired
}

export default SelfAssesmentForm
