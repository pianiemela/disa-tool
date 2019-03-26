import React, { useState, useEffect, useReducer } from 'react'
import CategoryQuestion from './CategoryQuestion'
import { getCategoryQuestions } from '../../actions/categoryQuestion'
import { getCategories } from '../../actions/category'

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

const CategoryQuestionList = ({
  courseInstanceId,
  selfAssessmentFormId
}) => {
  const [categories, setCategories] = useState(null)
  const [questions, dispatchQuestions] = useReducer(questionReducer, null)
  const [init, setInit] = useState(false)

  useEffect(() => {
    if (!init) {
      setInit(true)
      getCategories(courseInstanceId).then((data) => {
        setCategories(data)
      })
      getCategoryQuestions(selfAssessmentFormId).then(({ data }) => {
        dispatchQuestions({
          type: 'GET_ALL',
          data
        })
      })
    }
  })

  if (!categories || !questions) return <div>Loading...</div>

  return categories.map(category => (
    <CategoryQuestion
      key={category.id}
      selfAssessmentFormId={selfAssessmentFormId}
      category={category}
      question={questions.find(question => question.category_id === category.id)}
      dispatchQuestions={dispatchQuestions}
    />
  ))
}

export default CategoryQuestionList
