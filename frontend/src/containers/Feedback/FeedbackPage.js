import React from 'react'
import PropTypes from 'prop-types'
import { Container } from 'semantic-ui-react'
import ObjectivesFeedback from './Components/ObjectivesFeedback'
import QuestionAndGradeFeedback from './Components/QuestionAndGradeFeedback'
import CategoryFeedback from './Components/CategoryFeedback'

const FeedbackPage = (props) => {
  
  const { assessmentResponse } = props
  const {
    assessmentType,
    questionModuleResponses,
    feedback,
    openQuestionResponses,
    finalGradeResponse,
    verification,
  } = assessmentResponse
  const { overallVerification } = verification
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
          teacher={props.teacher}
          verification={verification}
          />
        }
      <QuestionAndGradeFeedback
        openQuestionResponses={openQuestionResponses}
        finalGradeResponse={finalGradeResponse}
        overallVerification={overallVerification}
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
