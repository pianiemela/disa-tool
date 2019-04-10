import React from 'react'
import { number, shape, func, string } from 'prop-types'
import { Card, Header, Button } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import {
  createObjectiveQuestion,
  deleteObjectiveQuestion
} from '../../actions/objectiveQuestion'

const ObjectiveQuestion = ({
  selfAssessmentFormId,
  question,
  dispatchQuestions,
  objective,
  translate: baseTranslate,
  newOrder
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.ObjectiveQuestion.ObjectiveQuestion.${id}`)

  const addQuestion = () => {
    createObjectiveQuestion({
      self_assessment_form_id: selfAssessmentFormId,
      objective_id: objective.id,
      order: newOrder
    }).then(({ created }) => {
      // TODO: optimism
      dispatchQuestions({
        type: 'CREATE',
        created
      })
    })
  }
  const removeQuestion = () => {
    dispatchQuestions({
      type: 'DELETE',
      deleted: question
    })
    deleteObjectiveQuestion(question.id)
  }
  // TODO: DnD for editing order

  return (
    <Card fluid>
      <Card.Header>
        <Header>{objective.name}</Header>
      </Card.Header>
      <Card.Content>
        {question ? (
          <Button
            onClick={removeQuestion}
          >
            {translate('delete')}
          </Button>
        ) : (
          <Button
            onClick={addQuestion}
          >
            {translate('add')}
          </Button>
        )}
      </Card.Content>
    </Card>
  )
}

ObjectiveQuestion.propTypes = {
  selfAssessmentFormId: number.isRequired,
  question: shape({}),
  dispatchQuestions: func.isRequired,
  objective: shape({
    id: number.isRequired,
    name: string.isRequired
  }).isRequired,
  translate: func.isRequired,
  newOrder: number.isRequired
}

ObjectiveQuestion.defaultProps = {
  question: null
}

export default withLocalize(ObjectiveQuestion)
