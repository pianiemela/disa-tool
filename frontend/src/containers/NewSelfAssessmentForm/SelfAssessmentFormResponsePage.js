import React, { useState, useEffect } from 'react'
import { number, func } from 'prop-types'
import { Button, Container, Loader } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
import { withLocalize } from 'react-localize-redux'
import FinalGradeResponse from './components/FinalGradeQuestion/FinalGradeResponse'
import ResponseFormInfo from './components/FormInfo/ResponseFormInfo'
import CategoryResponseList from './components/CategoryQuestion/CategoryResponseList'
import ObjectiveResponseList from './components/ObjectiveQuestion/ObjectiveResponseList'
import OpenResponseList from './components/OpenQuestion/OpenResponseList'
import { getSelfAssessmentForm } from './actions/selfAssessmentForm'
import { createResponse } from './actions/response'
import { getGrades } from './actions/grade'

const SelfAssessmentFormResponsePage = ({
  selfAssessmentFormId,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssesmentForm.SelfAssessmentFormResponsePage.${id}`)
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

  if (redirect) return <Redirect to={redirect} />
  if (!selfAssessmentForm) return <Loader active inline />

  const submit = () => {
    setRedirect(`/user/course/${selfAssessmentForm.course_instance_id}`)
  }

  return (
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
          responseId={response.id}
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
      <Button type="button" onClick={submit}>{translate('save')}</Button>
    </Container>
  )
}

SelfAssessmentFormResponsePage.propTypes = {
  selfAssessmentFormId: number.isRequired,
  translate: func.isRequired
}

export default withLocalize(SelfAssessmentFormResponsePage)
