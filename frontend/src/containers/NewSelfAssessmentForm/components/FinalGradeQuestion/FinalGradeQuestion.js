import React, { useState, useEffect } from 'react'
import { number, func } from 'prop-types'
import { Card, Header, Button, Form } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import {
  getFinalGradeQuestion,
  createFinalGradeQuestion,
  editFinalGradeQuestion,
  deleteFinalGradeQuestion
} from '../../actions/finalGradeQuestion'
import MultilingualField from '../../../../utils/components/MultilingualField'
import useSave from '../../../../utils/hooks/useSave'

const FinalGradeQuestion = ({
  translate: baseTranslate,
  selfAssessmentFormId
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.FinalGradeQuestion.${id}`)
  const [question, setQuestion] = useState('loading')
  const saveChanges = useSave(() => {
    if (!question || !question.id) return
    editFinalGradeQuestion(question.id, question)
  })

  useEffect(() => {
    getFinalGradeQuestion(selfAssessmentFormId).then(({ data }) => {
      setQuestion(data)
    })
  }, [])
  const addQuestion = () => {
    const newQuestion = {
      text_field: false,
      eng_prompt: '',
      fin_prompt: '',
      swe_prompt: '',
      self_assessment_form_id: selfAssessmentFormId
    }
    setQuestion(newQuestion)
    createFinalGradeQuestion(newQuestion).then(({ created }) => {
      setQuestion({
        ...question,
        id: created.id
      })
    })
  }
  const removeQuestion = () => {
    setQuestion(null)
    deleteFinalGradeQuestion(question.id)
  }
  const toggleTextField = () => {
    const edited = {
      ...question,
      text_field: !question.text_field
    }
    setQuestion(edited)
    saveChanges()
  }
  const onPromptChange = ({ eng, fin, swe }) => {
    const edited = {
      ...question,
      eng_prompt: eng,
      fin_prompt: fin,
      swe_prompt: swe
    }
    setQuestion(edited)
    saveChanges()
  }

  if (question === 'loading') {
    return (
      <Card fluid>
        <Card.Header>
          <Header>{translate('card_header')}</Header>
        </Card.Header>
        <Card.Content>
          Loading...
        </Card.Content>
      </Card>
    )
  }

  return (
    <Card fluid>
      <Card.Header>
        <Header>{translate('card_header')}</Header>
      </Card.Header>
      {question ? (
        <Card.Content>
          <Button
            type="button"
            onClick={removeQuestion}
          >
            {translate('delete')}
          </Button>
          <MultilingualField
            values={{
              eng: question.eng_prompt || '',
              fin: question.fin_prompt || '',
              swe: question.swe_prompt || ''
            }}
            field="prompt"
            fieldDisplay={translate('prompt')}
            onChange={onPromptChange}
          />
          <div
            style={{
              position: 'relative'
            }}
          >
            <div
              style={{
                cursor: 'pointer',
                position: 'absolute',
                textAlign: 'center',
                paddingTop: '30px',
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                margin: 'auto'
              }}
              onClick={toggleTextField}
            >
              <Button
                type="button"
              >
                {(
                  question.text_field
                    ? translate('text_field_on')
                    : translate('text_field_off')
                )}
              </Button>
            </div>
            <Form.TextArea
              autoHeight
              disabled={!question.text_field}
            />
          </div>
        </Card.Content>
      ) : (
        <Card.Content>
          <Button
            type="button"
            onClick={addQuestion}
          >
            {translate('add')}
          </Button>
        </Card.Content>
      )}
    </Card>
  )
}

FinalGradeQuestion.propTypes = {
  selfAssessmentFormId: number.isRequired,
  translate: func.isRequired
}

export default withLocalize(FinalGradeQuestion)
