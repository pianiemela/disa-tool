import React, { useState } from 'react'
import { number, shape, arrayOf } from 'prop-types'
import { Table } from 'semantic-ui-react'
import { getObjectiveQuestions } from '../../actions/objectiveQuestion'
import ObjectiveFeedback from './ObjectiveFeedback'

const ObjectiveFeedbackList = ({
  selfAssessmentFormId,
  feedback
}) => {
  const [questions, setQuestions] = useState([])
  useState(() => {
    getObjectiveQuestions(selfAssessmentFormId).then(({ data }) => {
      setQuestions(data)
    })
  }, [selfAssessmentFormId])

  if (!feedback) return null

  return (
    <Table>
      <Table.Body>
        {questions.map(question => (
          <ObjectiveFeedback
            key={question.id}
            response={feedback ? (
              feedback.objectiveResponses.find(or => or.objectiveId === question.objective_id)
            ) : null}
          />
        ))}
      </Table.Body>
    </Table>
  )
}

ObjectiveFeedbackList.propTypes = {
  selfAssessmentFormId: number.isRequired,
  feedback: shape({
    objectiveResponses: arrayOf(shape({
      objectiveId: number.isRequired
    }).isRequired).isRequired
  })
}

ObjectiveFeedbackList.defaultProps = {
  feedback: null
}

export default ObjectiveFeedbackList
