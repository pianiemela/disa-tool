import React from 'react'
import { Form, Grid, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import ObjectiveQuestionModule from './FormParts/QuestionModules/ObjectiveQuestionModule'
import CategoryQuestionModule from './FormParts/QuestionModules/CategoryQuestionModule'
import OpenQuestionModule from './FormParts/QuestionModules/OpenQuestionModule'

import './selfAssesment.css'
import SelfAssesmentSection from './FormParts/Sections/SelfAssesmentSection'

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

  const editForm = (type, formData, edit) => (
    (
      <div>
        {type === 'category' ?

          <SelfAssesmentSection
            header="Kategoriaosio"
            formData={formData.questionModules}
            edit={edit}
            textArea={textArea}
            QuestionModule={CategoryQuestionModule}
          />
          :
          <SelfAssesmentSection
            header="Tavoiteosio"
            formData={formData.questionModules}
            edit={edit}
            textArea={textArea}
            QuestionModule={ObjectiveQuestionModule}
          />
        }

        <SelfAssesmentSection
          header="Avoimet kysymykset"
          formData={formData.openQuestions}
          edit={edit}
          textArea={textArea}
          QuestionModule={OpenQuestionModule}
          question
        />

        {type === 'category' ?

          <SelfAssesmentSection
            header="Loppuarvio"
            formData={formData.finalGrade}
            edit={edit}
            textArea={textArea}
            QuestionModule={CategoryQuestionModule}
          />
          :
          null
        }
        <Button positive style={{ marginBottom: '25px' }}>
          Tallenna lomake
        </Button>

      </div>
    )
  )

  const renderEditableForm = () => {
    if (props.edit) {
      const { formData, edit, handleChange } = props
      console.log(formData)
      return editForm(formData.type, formData.structure, edit, handleChange)
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
  edit: PropTypes.bool.isRequired
}

export default SelfAssesmentForm
