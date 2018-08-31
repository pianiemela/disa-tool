import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

export const CategoryFeedback = (props) => {
  const { questionModuleResponses, feedback } = props
  const translate = id => props.translate(`SelfAssessment.FeedbackPage.CategoryFeedback.${id}`)
  return (
    <div>
      {props.teacher ? null : (
        <h2>
          {translate('message')}
        </h2>
      )}
      {questionModuleResponses.map(questionModule => (
        <Card.Group key={questionModule.id} itemsPerRow={feedback ? 2 : 1}>
          <Card fluid color="red" >
            <Card.Content >
              <Card.Header textAlign="center">
                <h3>{questionModule.name}</h3>
              </Card.Header>
              <Card.Description textAlign="center">
                <h4>
                  {translate('grade')}: {questionModule.grade}
                </h4>
                {questionModule.textFieldOn ?
                  <div>
                    <h5>{(translate('explanation'))}:</h5>
                    <p>{questionModule.responseText}</p>
                  </div>
                  :
                  null}
              </Card.Description>
            </Card.Content>
          </Card>
          {feedback ?
            <Card fluid color="red">
              <Card.Content >
                <Card.Header textAlign="center">
                  <h3>{translate('feedback')}</h3>
                </Card.Header>
                <Card.Description textAlign="center">
                  {feedback.find(f => f.categoryId === questionModule.id).text}
                </Card.Description>
              </Card.Content>
            </Card> : undefined}
        </Card.Group>
      ))}
    </div >
  )
}

CategoryFeedback.defaultProps = {
  questionModuleResponses: [],
  feedback: null,
  teacher: false
}

CategoryFeedback.propTypes = {
  questionModuleResponses: PropTypes.arrayOf(PropTypes.shape()),
  feedback: PropTypes.arrayOf(PropTypes.shape()),
  teacher: PropTypes.bool,
  translate: PropTypes.func.isRequired
}

export default withLocalize(CategoryFeedback)
