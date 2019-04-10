import React from 'react'
import { shape, arrayOf, number } from 'prop-types'
import CategoryFeedback from './CategoryFeedback'

const CategoryFeedbackList = ({
  feedback,
  grades
}) => {
  if (!feedback) return null
  return feedback.categories.map(category => (
    <CategoryFeedback
      key={category.id}
      category={category}
      grades={grades}
    />
  ))
}

CategoryFeedbackList.propTypes = {
  feedback: shape({
    categories: arrayOf(shape({
      id: number.isRequired
    })).isRequired
  })
}

export default CategoryFeedbackList
