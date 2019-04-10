import React, { useState, useEffect } from 'react'
import { number } from 'prop-types'
import { getObjectiveQuestions } from '../../actions/objectiveQuestion'
import { getObjectives } from '../../actions/objective'
import ObjectiveResponse from './ObjectiveResponse'
import { getObjectiveResponses } from '../../actions/objectiveResponse'

const ObjectiveResponseList = ({
  selfAssessmentFormId,
  courseInstanceId,
  responseId
}) => {
  const [questions, setQuestions] = useState([])
  const [objectives, setObjectives] = useState({})
  const [responses, setResponses] = useState({})

  useEffect(() => {
    getObjectiveQuestions(selfAssessmentFormId).then(({ data }) => {
      setQuestions(data)
    })
  }, [selfAssessmentFormId])
  useEffect(() => {
    getObjectives(courseInstanceId).then(({ data }) => {
      setObjectives(data.reduce(
        (acc, objective) => ({
          ...acc,
          [objective.id]: objective
        }),
        {}
      ))
    })
  }, [courseInstanceId])
  useEffect(() => {
    if (!responseId) return
    getObjectiveResponses(responseId).then(({ data }) => {
      setResponses(data.reduce(
        (acc, objectiveResponse) => ({
          ...acc,
          [objectiveResponse.objective_question_id]: objectiveResponse
        }),
        {}
      ))
    })
  }, [responseId])

  return questions.map(question => (
    <ObjectiveResponse
      key={question.id}
      responseId={responseId}
      response={responses[question.id]}
      question={question}
      objective={objectives[question.objective_id]}
    />
  ))
}

ObjectiveResponseList.propTypes = {
  selfAssessmentFormId: number.isRequired,
  courseInstanceId: number.isRequired,
  responseId: number
}

export default ObjectiveResponseList
