import React, { useReducer, useEffect } from 'react'
import { number } from 'prop-types'
import OpenQuestion from './OpenQuestion'
import OpenQuestionCreateForm from './OpenQuestionCreateForm'
import { getOpenQuestions } from '../../actions/openQuestion'

const questionReducer = (state, action) => {
  switch (action.type) {
    case 'GET_ALL':
      return action.data
    case 'DELETE':
      return state.filter(question => question.id !== action.deleted.id)
    case 'CREATE':
      return state.concat(action.created)
    case 'UPDATE':
      return state.map(question => (
        question.id === action.edited.id
          ? {
            ...question,
            ...action.edited
          }
          : question
      ))
    default:
      return state
  }
}

const OpenQuestionList = ({
  selfAssessmentFormId
}) => {
  const [questions, dispatchQuestions] = useReducer(questionReducer, null)

  useEffect(() => {
    if (!questions) {
      getOpenQuestions(selfAssessmentFormId).then(({ data }) => {
        dispatchQuestions({
          type: 'GET_ALL',
          data
        })
      })
    }
  })

  if (!questions) return <div>Loading...</div>

  return (
    <div>
      {questions.map(question => (
        <OpenQuestion
          key={question.id}
          question={question}
          dispatchQuestions={dispatchQuestions}
        />
      ))}
      <OpenQuestionCreateForm
        selfAssessmentFormId={selfAssessmentFormId}
        dispatchQuestions={dispatchQuestions}
      />
    </div>
  )
}

OpenQuestionList.propTypes = {
  selfAssessmentFormId: number.isRequired
}

export default OpenQuestionList

