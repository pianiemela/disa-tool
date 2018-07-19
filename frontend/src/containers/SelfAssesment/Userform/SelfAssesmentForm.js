import React from 'react'
import { Form, Grid, Button } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import ObjectiveQuestionModule from './FormParts/QuestionModules/ObjectiveQuestionModule'
import CategoryQuestionModule from './FormParts/QuestionModules/CategoryQuestionModule'
import OpenQuestionModule from './FormParts/QuestionModules/OpenQuestionModule'
import SelfAssesmentInfo from './FormParts/Sections/SelfAssesmentInfo'
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

  const editForm = (formData, edit) => {
    const { structure } = formData
    const { displayCoursename, type, formInfo } = structure

    return (
      <div>
        <h2 style={{ textAlign: 'center' }}>{displayCoursename}</h2>

        <SelfAssesmentInfo
          header="Yleistä tietoa itsearvioinnista"
          textArea={textArea}
          formData={formInfo}
        />

        {type === 'category' ?
          <SelfAssesmentSection
            header="Kategoriaosio"
            formData={structure.questionModules}
            edit={edit}
            textArea={textArea}
            QuestionModule={CategoryQuestionModule}
          />
          :
          <SelfAssesmentSection
            header="Tavoiteosio"
            formData={structure.questionModules}
            edit={edit}
            textArea={textArea}
            QuestionModule={ObjectiveQuestionModule}
          />
        }

        <SelfAssesmentSection
          header="Avoimet kysymykset"
          formData={structure.openQuestions}
          edit={edit}
          textArea={textArea}
          QuestionModule={OpenQuestionModule}
          question
        />

        {type === 'category' ?

          <SelfAssesmentSection
            header="Loppuarvio"
            formData={structure.finalGrade}
            edit={edit}
            textArea={textArea}
            QuestionModule={CategoryQuestionModule}
            final
          />
          :
          null
        }
        <Button
          positive
          style={{ marginBottom: '25px' }}
          onClick={props.handleSubmit}
        >
          {props.bText}
        </Button>

      </div>
    )
  }

  const renderEditableForm = () => {
    if (props.edit) {
      const { formData, edit } = props
      return editForm(formData, edit)
    }
    return null
  }

  return (
    <div>
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
