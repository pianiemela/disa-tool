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

const INITIAL_PROMPT = { eng: '', fin: '', swe: '' }

const FinalGradeQuestion = ({
  translate: baseTranslate,
  selfAssessmentFormId
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.FinalGradeQuestion.${id}`)
  const [question, setQuestion] = useState('loading')
  const [prompt, setPrompt] = useState(question ? question.prompt : INITIAL_PROMPT)

  useEffect(() => {
    getFinalGradeQuestion(selfAssessmentFormId).then(({ data }) => {
      setQuestion(data)
      setPrompt(data ? {
        eng: data.eng_prompt,
        fin: data.fin_prompt,
        swe: data.swe_prompt
      } : INITIAL_PROMPT)
    })
  }, [])
  const addQuestion = () => {
    createFinalGradeQuestion({
      self_assessment_form_id: selfAssessmentFormId,
      eng_prompt: prompt.eng,
      fin_prompt: prompt.fin,
      swe_prompt: prompt.swe,
      text_field: false
    }).then(({ created }) => {
      // TODO: optimism
      setQuestion(created)
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
    editFinalGradeQuestion(question.id, edited)
  }
  const saveChanges = () => {
    const edited = {
      ...question,
      eng_prompt: prompt.eng,
      fin_prompt: prompt.fin,
      swe_prompt: prompt.swe
    }
    setQuestion(edited)
    editFinalGradeQuestion(question.id, edited)
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
            values={prompt}
            field="prompt"
            fieldDisplay={translate('prompt')}
            onChange={setPrompt}
          />
          <Button
            type="button"
            onClick={saveChanges}
          >
            {translate('save')}
          </Button>
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
          <MultilingualField
            field="prompt"
            fieldDisplay={translate('prompt')}
            onChange={setPrompt}
          />
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
