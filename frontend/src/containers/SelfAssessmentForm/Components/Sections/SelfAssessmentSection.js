import React from 'react'
import { Card } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import AddOpenQuestion from '../addOpenQuestion'
import Header from '../Header'

const SelfAssessmentSection = (props) => {
  const { final,
    question,
    edit,
    QuestionModule,
    formData,
    errors,
    clearError,
    courseInstanceId,
    grades,
    name,
    headers
  } = props

  const { responseText, grade } = errors
  const questions = (
    edit ?
      formData.map(questionModules =>
        (
          <QuestionModule
            key={questionModules.id}
            data={questionModules}
            edit={edit}
            final={final}
            courseInstanceId={courseInstanceId}
            grades={grades}
          />
        ))
      :
      formData.map(questionModules =>
        ((questionModules.includedInAssesment || question) &&
          (<QuestionModule
            key={questionModules.id}
            data={questionModules}
            edit={edit}
            final={final}
            courseInstanceId={courseInstanceId}
            gradeError={final ? grade[0] : grade.find(e => e.id === questionModules.id)}
            responseTextError={final ?
              responseText[0] :
              responseText.find(e => e.id === questionModules.id)}
            clearError={clearError}
            grades={grades}
          />)
        )))


  return (

    <div>
      <Card fluid color="red" className="formCard">
        <Card.Content>
          <Header
            editButton={final}
            name={final ? formData[0].header : name}
            edit={edit}
            headerType={props.headerType}
            headers={headers}
            style={final && { color: formData[0].includedInAssesment ? 'black' : 'grey' }}
          />
          {questions}
          {(question && edit) &&
            <AddOpenQuestion />
          }
        </Card.Content>
      </Card>
    </div>
  )
}

SelfAssessmentSection.defaultProps = {
  question: false,
  final: false,
  headerType: null,
  courseInstanceId: null,
  clearError: null,
  grades: null,
  name: '',
  headers: []
}

SelfAssessmentSection.propTypes = {
  formData: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    includedInAssesment: PropTypes.bool
  })).isRequired,
  edit: PropTypes.bool.isRequired,
  question: PropTypes.bool,
  QuestionModule: PropTypes.func.isRequired,
  final: PropTypes.bool,
  headerType: PropTypes.string,
  clearError: PropTypes.func,
  errors: PropTypes.shape({
    responseText: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired
    }))
  }).isRequired,
  courseInstanceId: PropTypes.number,
  grades: PropTypes.arrayOf(PropTypes.object),
  name: PropTypes.string,
  headers: PropTypes.arrayOf(PropTypes.shape())
}

export default SelfAssessmentSection
