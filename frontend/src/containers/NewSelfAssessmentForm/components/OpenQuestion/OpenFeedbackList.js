import React from 'react'
import { shape, arrayOf, number } from 'prop-types'
import OpenFeedback from './OpenFeedback'

const OpenFeedbackList = ({
  feedback
}) => {
  if (!feedback) return null
  const { openResponses } = feedback
  return openResponses.map(openResponse => (
    <OpenFeedback key={openResponse.id} openResponse={openResponse} />
  ))
}

OpenFeedbackList.propTypes = {
  feedback: shape({
    openResponses: arrayOf(shape({
      id: number.isRequired
    }).isRequired).isRequired
  })
}

export default OpenFeedbackList
