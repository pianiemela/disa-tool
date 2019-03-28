import React, { useState, useEffect } from 'react'
import { number, array } from 'prop-types'
import { getCategoryQuestions } from '../../actions/categoryQuestion'
import { getCategoryResponses } from '../../actions/categoryResponse'
import CategoryResponse from './CategoryResponse'
import { getCategories } from '../../actions/category'

const CategoryResponseList = ({
  selfAssessmentFormId,
  responseId,
  courseInstanceId,
  grades
}) => {
  const [questions, setQuestions] = useState([])
  const [responses, setResponses] = useState({})
  const [categories, setCategories] = useState({})

  useEffect(() => {
    getCategoryQuestions(selfAssessmentFormId).then(({ data }) => {
      setQuestions(data)
    })
    getCategories(courseInstanceId).then((data) => {
      setCategories(data.reduce(
        (acc, category) => ({
          ...acc,
          [category.id]: category
        }),
        {}
      ))
    })
  }, [])

  useEffect(() => {
    if (!responseId) return
    getCategoryResponses(responseId).then(({ data }) => {
      setResponses(data.reduce(
        (acc, response) => ({
          ...acc,
          [response.category_question_id]: response
        }),
        {}
      ))
    })
  }, [responseId])

  return questions.map(question => (
    <CategoryResponse
      key={question.id}
      question={question}
      category={categories[question.category_id]}
      response={(
        responses[question.id]
        || { category_question_id: question.id, response_id: responseId }
      )}
      grades={grades}
    />
  ))
}

CategoryResponseList.propTypes = {
  selfAssessmentFormId: number.isRequired,
  responseId: number,
  courseInstanceId: number.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  grades: array.isRequired
}

CategoryResponse.defaultProps = {
  responseId: null
}

export default CategoryResponseList
