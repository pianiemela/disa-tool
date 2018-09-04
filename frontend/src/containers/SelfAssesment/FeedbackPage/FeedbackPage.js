import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'semantic-ui-react'
import ObjectivesFeedback from './ObjectivesFeedback'
import QuestionAndGradeFeedback from './QuestionAndGradeFeedback'
import CategoryFeedback from './CategoryFeedback'

const FeedbackPage = (props) => {
  const { assessmentResponse } = props
  const {
    assessmentType,
    questionModuleResponses,
    feedback,
    openQuestionResponses,
    finalGradeResponse } = assessmentResponse
  const objectives = {}

  if (assessmentResponse.assessmentType === 'objectives') {
    assessmentResponse.questionModuleResponses.forEach((asr) => {
      if (!objectives[asr.header]) {
        objectives[asr.header] = []
      }
      objectives[asr.header].push(asr)
    })
  }
  return (
    <Container textAlign="center">
      {assessmentType === 'objectives' ?
        <ObjectivesFeedback
          teacher={props.teacher}
          objectives={objectives}
        />
        :
        <CategoryFeedback
          questionModuleResponses={questionModuleResponses}
          feedback={feedback}
        />
      }
      <QuestionAndGradeFeedback
        openQuestionResponses={openQuestionResponses}
        finalGradeResponse={finalGradeResponse}
      />
    </Container>
  )
}


FeedbackPage.propTypes = {
  assessmentResponse: PropTypes.shape().isRequired,
  teacher: PropTypes.bool
}

FeedbackPage.defaultProps = {
  teacher: false
}

export default FeedbackPage
