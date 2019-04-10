import React, { useState, useEffect } from 'react'
import { number } from 'prop-types'
import { Container } from 'semantic-ui-react'
import { getIndividualFeedback, getSelfAssessmentForm } from './actions/selfAssessmentForm'
import { getGrades } from './actions/grade'
import FeedbackFormInfo from './components/FormInfo/FeedbackFormInfo'
import CategoryFeedbackList from './components/CategoryQuestion/CategoryFeedbackList'
import OpenFeedbackList from './components/OpenQuestion/OpenFeedbackList'
import FinalGradeFeedback from './components/FinalGradeQuestion/FinalGradeFeedback'
import ObjectiveFeedbackList from './components/ObjectiveQuestion/ObjectiveFeedbackList'

const SelfAssessmentFormFeedbackPage = ({
  selfAssessmentFormId,
  userId
}) => {
  const [feedback, setFeedback] = useState(null)
  const [selfAssessmentForm, setSelfAssessmentForm] = useState({})
  const [grades, setGrades] = useState({})
  useEffect(() => {
    getIndividualFeedback(selfAssessmentFormId, userId).then(({ data }) => {
      setFeedback(data)
    })
  }, [selfAssessmentFormId, userId])
  useEffect(() => {
    getSelfAssessmentForm(selfAssessmentFormId).then(({ data }) => {
      setSelfAssessmentForm(data)
    })
  }, [selfAssessmentFormId])
  useEffect(() => {
    if (!selfAssessmentForm.course_instance_id) return
    getGrades(selfAssessmentForm.course_instance_id).then(({ data }) => {
      setGrades(data.reduce(
        (acc, grade) => ({
          ...acc,
          [grade.id]: grade
        }),
        {}
      ))
    })
  }, [selfAssessmentForm.course_instance_id])

  const questionModules = () => {
    switch (selfAssessmentForm.type) {
      case 'CATEGORIES':
        return (
          <CategoryFeedbackList
            feedback={feedback}
            grades={grades}
          />
        )
      case 'OBJECTIVES':
        return (
          <ObjectiveFeedbackList
            selfAssessmentFormId={selfAssessmentFormId}
            courseInstanceId={selfAssessmentForm.course_instance_id}
            feedback={feedback}
          />
        )
      default:
        return null
    }
  }

  return (
    <Container>
      <FeedbackFormInfo selfAssessmentForm={selfAssessmentForm} />
      {questionModules()}
      <OpenFeedbackList
        feedback={feedback}
      />
      <FinalGradeFeedback
        feedback={feedback}
        grades={grades}
      />
    </Container>
  )
}

SelfAssessmentFormFeedbackPage.propTypes = {
  selfAssessmentFormId: number.isRequired,
  userId: number.isRequired
}

export default SelfAssessmentFormFeedbackPage
