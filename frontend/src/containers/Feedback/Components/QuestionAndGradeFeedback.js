import React from 'react'
import { Card } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'

export const QuestionAndGradeFeedback = (props) => {
  const { openQuestionResponses, finalGradeResponse } = props
  const translate = id => props.translate(`FeedbackPage.QuestionAndGradeFeedback.${id}`)

  return (
    <div style={{ marginTop: '50px' }}>
      {openQuestionResponses.length > 0 ?
        <h2>{translate('header')}</h2>
        :
        null}
      {
        openQuestionResponses.map(openQ => (
          <Card key={openQ.id} fluid color="red" >
            <Card.Content >
              <Card.Header textAlign="center">
                <h3>{openQ.name}</h3>
              </Card.Header>
              <Card.Description textAlign="center">
                <div>
                  <h5>{translate('response')}:</h5>
                  <p>{openQ.responseText}</p>
                </div>

              </Card.Description>
            </Card.Content>
          </Card>
        ))
      }

      {
        Object.keys(finalGradeResponse).length > 1 ?
          <div>
            <h2>{translate('grade')}</h2>
            <Card key={finalGradeResponse.name} fluid color="red" >
              <Card.Content >
                <Card.Header textAlign="center">
                  <h3>{finalGradeResponse.name}</h3>
                </Card.Header>
                <Card.Description textAlign="center">
                  <h4>
                    {translate('assessedGrade')}: {finalGradeResponse.grade}
                  </h4>
                  {finalGradeResponse.responseText.length > 0 ?
                    <div>
                      <h5>{translate('explanation')}:</h5>
                      <p>{finalGradeResponse.responseText}</p>
                    </div>
                    :
                    null}
                </Card.Description>
              </Card.Content>
            </Card>
          </div>
          :
          null
      }
    </div >
  )
}

QuestionAndGradeFeedback.defaultProps = {
  openQuestionResponses: [],
  finalGradeResponse: {}
}

QuestionAndGradeFeedback.propTypes = {
  openQuestionResponses: PropTypes.arrayOf(PropTypes.shape()),
  finalGradeResponse: PropTypes.shape(),
  translate: PropTypes.func.isRequired
}

export default withLocalize(QuestionAndGradeFeedback)
