import React, { useState, useEffect } from 'react'
import { number } from 'prop-types'
import { Button, Form, Container } from 'semantic-ui-react'
import FinalGradeQuestion from './components/FinalGradeQuestion/FinalGradeQuestion'
import FormInfo from './components/FormInfo/FormInfo'
import CategoryQuestionList from './components/CategoryQuestion/CategoryQuestionList'
import ObjectiveQuestionList from './components/ObjectiveQuestion/ObjectiveQuestionList'
import OpenQuestionList from './components/OpenQuestion/OpenQuestionList'
import { getSelfAssessmentForm } from './actions/selfAssessmentForm'

const NewSelfAssessmentFormPage = ({
  selfAssessmentFormId
}) => {
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(null)
  const [selfAssessmentForm, setSelfAssessmentForm] = useState(null)

  useEffect(() => {
    if (selfAssessmentForm || loading) return
    setLoading(true)
    getSelfAssessmentForm(selfAssessmentFormId).then(({ data }) => {
      setSelfAssessmentForm(data)
      setLoading(false)
    })
  })

  if (redirect) return <div>Redirect</div>
  if (loading) return <div>Loading...</div>
  if (!selfAssessmentForm) return <div />

  const submit = () => {
    setTimeout(() => {
      setRedirect('/')
    }, 2000)
  }

  return (
    <Form>
      <Container>
        <FormInfo
          selfAssessmentForm={selfAssessmentForm}
          setSelfAssessmentForm={setSelfAssessmentForm}
        />
        {selfAssessmentForm.type === 'CATEGORIES' ? (
          <CategoryQuestionList
            selfAssessmentFormId={selfAssessmentFormId}
            courseInstanceId={selfAssessmentForm.course_instance_id}
          />
        ) : (
          <ObjectiveQuestionList
            selfAssessmentFormId={selfAssessmentFormId}
            courseInstanceId={selfAssessmentForm.course_instance_id}
          />
        )}
        <OpenQuestionList
          selfAssessmentFormId={selfAssessmentFormId}
        />
        <FinalGradeQuestion
          selfAssessmentFormId={selfAssessmentFormId}
        />
        <Button type="button" onClick={submit}>translate: Save</Button>
      </Container>
    </Form>
  )
}

NewSelfAssessmentFormPage.propTypes = {
  selfAssessmentFormId: number.isRequired
}

export default NewSelfAssessmentFormPage
