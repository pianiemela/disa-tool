import React, { useState, useEffect } from 'react'
import { number, shape, string, func } from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import { Card, Header, Button } from 'semantic-ui-react'
import { createObjectiveResponse, editObjectiveResponse } from '../../actions/objectiveResponse'

const ObjectiveResponse = ({
  responseId,
  response: initResponse,
  question,
  objective,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.ObjectieQuestion.ObjectiveResponse.${id}`)
  const [response, setResponse] = useState({
    response_id: null,
    objective_question_id: question.id,
    id: null,
    answer: null
  })
  useEffect(() => {
    setResponse({
      ...response,
      response_id: responseId
    })
  }, [responseId])
  useEffect(() => {
    if (!initResponse) return
    setResponse(initResponse)
  }, [initResponse])
  const handleChange = option => () => {
    const edited = {
      ...response,
      answer: option
    }
    setResponse(edited)
    if (response.id) {
      editObjectiveResponse(response.id, edited)
    } else {
      createObjectiveResponse(edited).then(({ created }) => {
        setResponse(created)
      })
    }
  }

  return (
    <Card fluid>
      <Card.Header>
        <Header>{objective.name}</Header>
      </Card.Header>
      <Card.Content>
        <Button.Group disabled={!response.response_id}>
          <Button
            type="button"
            onClick={handleChange(1)}
            active={response.answer === 1}
          >
            {translate('option1')}
          </Button>
          <Button
            type="button"
            onClick={handleChange(2)}
            active={response.answer === 2}
          >
            {translate('option2')}
          </Button>
          <Button
            type="button"
            onClick={handleChange(3)}
            active={response.answer === 3}
          >
            {translate('option3')}
          </Button>
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

ObjectiveResponse.propTypes = {
  responseId: number,
  response: shape({
    id: number.isRequired,
    answer: number
  }),
  question: shape({
    id: number.isRequired
  }).isRequired,
  objective: shape({
    name: string.isRequired
  }),
  translate: func.isRequired
}

ObjectiveResponse.defaultProps = {
  responseId: null,
  response: null,
  objective: { name: '' }
}

export default withLocalize(ObjectiveResponse)
