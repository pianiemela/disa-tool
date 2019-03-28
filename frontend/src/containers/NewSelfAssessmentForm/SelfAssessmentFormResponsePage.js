import React, { useState, useEffect } from 'react'
import { number } from 'prop-types'
import { Button, Form, Container } from 'semantic-ui-react'
import FinalGradeResponse from './components/FinalGradeQuestion/FinalGradeResponse'
import ResponseFormInfo from './components/FormInfo/ResponseFormInfo'
import CategoryResponseList from './components/CategoryQuestion/CategoryResponseList'
import ObjectiveResponseList from './components/ObjectiveQuestion/ObjectiveResponseList'
import OpenResponseList from './components/OpenQuestion/OpenResponseList'
import { getSelfAssessmentForm } from './actions/selfAssessmentForm'
import { createResponse } from './actions/response'
import { getGrades } from './actions/grade'

const SelfAssessmentFormResponsePage = ({
  selfAssessmentFormId
}) => {
  const [redirect, setRedirect] = useState(null)
  const [selfAssessmentForm, setSelfAssessmentForm] = useState(null)
  const [response, setResponse] = useState({ id: null })
  const [grades, setGrades] = useState([])

  useEffect(() => {
    getSelfAssessmentForm(selfAssessmentFormId).then(({ data }) => {
      setSelfAssessmentForm(data)
      getGrades(data.course_instance_id).then(({ data: gradeData }) => {
        setGrades(gradeData)
      })
    })
    createResponse({
      self_assessment_form_id: selfAssessmentFormId
    }).then(({ created }) => {
      setResponse(created)
    })
  }, [])

  if (redirect) return <div>Redirect</div>
  if (!selfAssessmentForm) return <div>Loading...</div>

  const submit = (event) => {
    event.preventDefault()
    setRedirect('/')
  }

  return (
    <Form onSubmit={submit}>
      <Container>
        <ResponseFormInfo
          selfAssessmentForm={selfAssessmentForm}
        />
        {selfAssessmentForm.type === 'CATEGORIES' ? (
          <CategoryResponseList
            selfAssessmentFormId={selfAssessmentFormId}
            courseInstanceId={selfAssessmentForm.course_instance_id}
            responseId={response.id}
            grades={grades}
          />
        ) : (
          <ObjectiveResponseList
            selfAssessmentFormId={selfAssessmentFormId}
            courseInstanceId={selfAssessmentForm.course_instance_id}
          />
        )}
        <OpenResponseList
          selfAssessmentFormId={selfAssessmentFormId}
          responseId={response.id}
        />
        <FinalGradeResponse
          selfAssessmentFormId={selfAssessmentFormId}
          responseId={response.id}
          grades={grades}
        />
        <Button type="submit">translate: Save</Button>
      </Container>
    </Form>
  )
}

SelfAssessmentFormResponsePage.propTypes = {
  selfAssessmentFormId: number.isRequired
}

export default SelfAssessmentFormResponsePage
