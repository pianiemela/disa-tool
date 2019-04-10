import React, { useState, useEffect, useReducer } from 'react'
import { number } from 'prop-types'
import { getObjectiveQuestions } from '../../actions/objectiveQuestion'
import { getObjectives } from '../../actions/objective'
import ObjectiveQuestion from './ObjectiveQuestion'

const questionReducer = (state, action) => {
  switch (action.type) {
    case 'GET_ALL':
      return action.data
    case 'DELETE':
      return state.filter(question => question.id !== Number(action.deleted.id))
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

const ObjectiveQuestionList = ({
  selfAssessmentFormId,
  courseInstanceId
}) => {
  const [questions, dispatchQuestions] = useReducer(questionReducer, [])
  const [objectives, setObjectives] = useState([])

  useEffect(() => {
    getObjectiveQuestions(selfAssessmentFormId).then(({ data }) => {
      dispatchQuestions({
        type: 'GET_ALL',
        data
      })
    })
  }, [selfAssessmentFormId])
  useEffect(() => {
    getObjectives(courseInstanceId).then(({ data }) => {
      setObjectives(data)
    })
  }, [courseInstanceId])

  let newOrder = 0
  const components = objectives.map((objective) => {
    const question = questions.find(q => q.objective_id === objective.id)
    if (question) {
      newOrder = question.order
    } else {
      newOrder += 1
    }
    return {
      order: newOrder,
      component: (
        <ObjectiveQuestion
          key={objective.id}
          selfAssessmentFormId={selfAssessmentFormId}
          objective={objective}
          question={question}
          dispatchQuestions={dispatchQuestions}
          newOrder={newOrder}
        />
      )
    }
  })
  return components.sort((a, b) => a.order - b.order).map(({ component }) => component)
}

ObjectiveQuestionList.propTypes = {
  selfAssessmentFormId: number,
  courseInstanceId: number
}

export default ObjectiveQuestionList
