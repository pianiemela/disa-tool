import React, { useState, useEffect } from 'react'
import { number } from 'prop-types'
import { getOpenQuestions } from '../../actions/openQuestion'
import { getOpenResponses } from '../../actions/openResponse'
import OpenResponse from './OpenResponse'

const OpenResponseList = ({
  selfAssessmentFormId,
  responseId
}) => {
  const [questions, setQuestions] = useState([])
  const [responses, setResponses] = useState({})

  useEffect(() => {
    getOpenQuestions(selfAssessmentFormId).then(({ data }) => {
      setQuestions(data)
    })
  }, [])

  useEffect(() => {
    if (!responseId) return
    getOpenResponses(responseId).then(({ data }) => {
      setResponses(data.reduce(
        (acc, response) => ({
          ...acc,
          [response.open_question_id]: response
        }),
        {}
      ))
    })
  }, [responseId])

  return questions.map(question => (
    <OpenResponse
      key={question.id}
      question={question}
      response={(
        responses[question.id]
        || { open_question_id: question.id, response_id: responseId }
      )}
    />
  ))
}

OpenResponseList.propTypes = {
  selfAssessmentFormId: number.isRequired,
  response: number
}

export default OpenResponseList
