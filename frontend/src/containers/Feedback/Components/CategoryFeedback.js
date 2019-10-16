import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Accordion, Card, Icon, Progress } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

const findVerificationGrade = (verification, categoryName) => {
  if (!verification) return null
  if (!verification.categoryVerifications) return null
  const category = verification.categoryVerifications.find(c => c.categoryName === categoryName)
  if (!category) return null
  return category.earnedGrade.name
}
export const CategoryFeedback = (props) => {
  const { questionModuleResponses, feedback, verification } = props
  const translate = id => props.translate(`FeedbackPage.CategoryFeedback.${id}`)
  return (
    <div>
      {props.teacher ? null : (
        <h2>
          {translate('message')}
        </h2>
      )}
      {feedback ?
        <Card fluid color="yellow">
          <Card.Content>
            <Card.Header>
              <h3>{translate('general_feedback')}</h3>
            </Card.Header>
            <Card.Description>
              {feedback.generalFeedback}
            </Card.Description>
          </Card.Content>
        </Card> : undefined}
      {questionModuleResponses.map(questionModule => (
        <Card.Group key={questionModule.id} itemsPerRow={feedback ? 2 : 1}>
          <Card fluid color="red" >
            <Card.Content >
              <Card.Header textAlign="center">
                <h3>{questionModule.name}</h3>
              </Card.Header>
              <Card.Description textAlign="center">
                <h4>
                  {translate('selfAssessedGrade')}: {questionModule.grade_name || questionModule.grade}
                  {props.teacher && (
                    <Fragment>
                      <br />
                      {translate('machineGrade')}: {findVerificationGrade(verification, questionModule.name)}
                    </Fragment>
                  )}
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
                  {feedback.categoryFeedback.find(f => f.categoryId === questionModule.id).text}
                </Card.Description>
              </Card.Content>
              <Card.Content>
                {feedback.categoryFeedback.find(f =>
                f.categoryId === questionModule.id).skillLevelObjectives.map((skillLevel, i) => (
                  <Accordion
                    key={i}
                    defaultActiveIndex={-1}
                    styled
                    fluid
                    panels={[{
                      key: skillLevel.skillLevel,
                      title: skillLevel.skillLevel,
                      content: {
                        key: `${skillLevel.skillLevel} objectives`,
                        content: skillLevel.objectives.map((objective, j) => (
                          objective.include ?
                            <div key={j}>
                              <h5>{objective.name} {objective.percentageDone === 100 ?
                                <Icon color="yellow" loading name="star" size="large" /> : undefined}
                              </h5>
                              <Progress
                                size="small"
                                percent={objective.percentageDone.toFixed(1)}
                                progress={props.teacher}
                                indicating
                              />
                            </div>
                          : undefined))
                      }
                    }]}
                  />
                ))}
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
  teacher: false,
  verification: {}
}

CategoryFeedback.propTypes = {
  questionModuleResponses: PropTypes.arrayOf(PropTypes.shape()),
  feedback: PropTypes.shape(),
  teacher: PropTypes.bool,
  translate: PropTypes.func.isRequired,
  verification: PropTypes.shape({})
}

export default withLocalize(CategoryFeedback)
