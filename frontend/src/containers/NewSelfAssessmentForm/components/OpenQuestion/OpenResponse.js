import React, { useState, useEffect } from 'react'
import { shape, number, string, func } from 'prop-types'
import { Card, Form, Label } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import { editOpenResponse, createOpenResponse } from '../../actions/openResponse'
import useSave from '../../../../utils/hooks/useSave'
import { getLanguage } from '../../../../utils/utils'

const OpenResponse = ({
  question,
  response: initResponse,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.OpenQuestion.OpenResponse.${id}`)
  const [response, setResponse] = useState({ text: '' })
  const lang = getLanguage()
  const saveChanges = useSave(() => {
    if (response.id) {
      editOpenResponse(response.id, response)
    } else {
      createOpenResponse(response).then(({ created }) => {
        setResponse({
          ...response,
          id: created.id
        })
      })
    }
  })

  useEffect(() => {
    if (initResponse) {
      setResponse(initResponse)
    }
  }, [initResponse])

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
        <p>{question[`${lang}_prompt`]}</p>
      </Card.Header>
      <Card.Content>
        <Label>{translate('answer')}</Label>
        <Form.TextArea
          onChange={onTextChange}
          value={response.text}
        />
      </Card.Content>
    </Card>
  )
}

OpenResponse.propTypes = {
  question: shape({
    id: number.isRequired,
    eng_prompt: string.isRequired,
    fin_prompt: string.isRequired,
    swe_prompt: string.isRequired
  }).isRequired,
  response: shape({
    open_question_id: number.isRequired,
    response_id: number,
    text: string
  }).isRequired,
  translate: func.isRequired
}

export default withLocalize(OpenResponse)
