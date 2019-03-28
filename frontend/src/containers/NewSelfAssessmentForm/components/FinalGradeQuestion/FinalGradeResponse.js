import React, { useState, useEffect } from 'react'
import { func, number, string, arrayOf, shape } from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Card, Header, Dropdown, Form, Label } from 'semantic-ui-react'
import {
  getFinalGradeResponse,
  createFinalGradeResponse,
  editFinalGradeResponse
} from '../../actions/finalGradeResponse'
import { getFinalGradeQuestion } from '../../actions/finalGradeQuestion'
import { getLanguage } from '../../../../utils/utils'
import useSave from '../../../../utils/hooks/useSave'

const FinalGradeResponse = ({
  selfAssessmentFormId,
  responseId,
  grades,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.FinalGradeQuestion.FinalGradeResponse.${id}`)
  const [question, setQuestion] = useState(null)
  const [response, setResponse] = useState({
    text: '',
    grade_id: null
  })
  const lang = getLanguage()
  const saveChanges = useSave(() => {
    if (response.id) {
      editFinalGradeResponse(response.id, response)
    } else {
      createFinalGradeResponse(response).then(({ created }) => {
        setResponse({
          ...response,
          id: created.id
        })
      })
    }
  })

  useEffect(() => {
    getFinalGradeQuestion(selfAssessmentFormId).then(({ data }) => {
      setQuestion(data)
    })
  }, [selfAssessmentFormId])

  useEffect(() => {
    if (!responseId) return
    getFinalGradeResponse(responseId).then(({ data }) => {
      if (data) setResponse(data)
    })
  }, [responseId])

  if (!question) return null

  const onGradeIdChange = (e, { value }) => {
    setResponse({
      ...response,
      grade_id: value
    })
    saveChanges()
  }
  const onTextChange = ({ target: { value } }) => {
    setResponse({
      ...response,
      text: value
    })
    saveChanges()
  }

  return (
    <Card fluid>
      <Card.Header>
        <Header>{translate('final_grade')}</Header>
      </Card.Header>
      <Card.Content>
        <p>{question[`${lang}_prompt`]}</p>
      </Card.Content>
      <div>
        <Label>{translate('grade')}</Label>
        <Dropdown
          selection
          value={response.grade_id}
          onChange={onGradeIdChange}
          options={grades.map(grade => ({
            key: grade.id,
            text: grade.name,
            value: grade.id
          })).concat({
            key: 0,
            text: '',
            value: null
          })}
        />
      </div>
      {question.text_field ? (
        <div>
          <Label>{translate('text_field')}</Label>
          <Form.TextArea
            value={response.text}
            onChange={onTextChange}
          />
        </div>
      ) : null}
    </Card>
  )
}

FinalGradeResponse.propTypes = {
  selfAssessmentFormId: number.isRequired,
  responseId: number,
  grades: arrayOf(shape({
    id: number.isRequired,
    name: string.isRequired
  })).isRequired,
  translate: func.isRequired
}

FinalGradeResponse.defaultProps = {
  responseId: null
}

export default withLocalize(FinalGradeResponse)
