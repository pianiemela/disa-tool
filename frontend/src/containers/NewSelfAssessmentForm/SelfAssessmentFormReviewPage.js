import React, { useState, useEffect } from 'react'
import { number } from 'prop-types'
import { Container, Loader, Card } from 'semantic-ui-react'
import Feedback from './components/Review/Feedback'
import { getFeedbacks, getSelfAssessmentForm } from './actions/selfAssessmentForm'
import { getGrades } from './actions/grade'
import CSVDownload from './components/Review/CSVDownload'
import { getLanguage } from '../../utils/utils'

const SelfAssessmentFormReviewPage = ({
  selfAssessmentFormId
}) => {
  const lang = getLanguage()
  const [students, setStudents] = useState([])
  const [selfAssessmentForm, setSelfAssessmentForm] = useState(null)
  const [grades, setGrades] = useState({})

  useEffect(() => {
    getFeedbacks(selfAssessmentFormId).then(({ data }) => {
      setStudents(data)
    })
    getSelfAssessmentForm(selfAssessmentFormId).then(({ data }) => {
      setSelfAssessmentForm(data)
    })
  }, [selfAssessmentFormId])

  useEffect(() => {
    if (!selfAssessmentForm) return
    getGrades(selfAssessmentForm.course_instance_id).then(({ data }) => {
      setGrades(data.reduce(
        (acc, grade) => ({
          ...acc,
          [grade.id]: grade
        }),
        {}
      ))
    })
  }, [selfAssessmentForm])

  if (!selfAssessmentForm) {
    return (
      <Container>
        <Loader active inline />
      </Container>
    )
  }

  return (
    <Container>
      <Card fluid>
        <Card.Content>
          <CSVDownload
            students={students}
            grades={grades}
            filePrefix={selfAssessmentForm[`${lang}_name`]}
          />
        </Card.Content>
      </Card>
      {students.map(student => (
        <Feedback
          key={student.id}
          selfAssessmentFormId={selfAssessmentFormId}
          student={student}
          grades={grades}
        />
      ))}
    </Container>
  )
}

SelfAssessmentFormReviewPage.propTypes = {
  selfAssessmentFormId: number.isRequired
}

export default SelfAssessmentFormReviewPage
