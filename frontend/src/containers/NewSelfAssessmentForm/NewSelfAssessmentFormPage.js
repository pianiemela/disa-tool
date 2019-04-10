import React, { useState, useEffect } from 'react'
import { number, func } from 'prop-types'
import { Button, Form, Container, Loader } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import { Redirect } from 'react-router-dom'
import FinalGradeQuestion from './components/FinalGradeQuestion/FinalGradeQuestion'
import FormInfo from './components/FormInfo/FormInfo'
import CategoryQuestionList from './components/CategoryQuestion/CategoryQuestionList'
import ObjectiveQuestionList from './components/ObjectiveQuestion/ObjectiveQuestionList'
import OpenQuestionList from './components/OpenQuestion/OpenQuestionList'
import { getSelfAssessmentForm } from './actions/selfAssessmentForm'

const NewSelfAssessmentFormPage = ({
  selfAssessmentFormId,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.NewSelfAssessmentFormPage.${id}`)
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

  if (redirect) return <Redirect to={redirect} />
  if (loading) return <Loader active />
  if (!selfAssessmentForm) return <div />

  const submit = () => {
    setTimeout(() => {
      setRedirect(`/user/course/${selfAssessmentForm.courseInstanceId}`)
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
        <Button
          type="button"
          onClick={submit}
          disabled={!selfAssessmentForm}
        >
          {translate('save')}
        </Button>
      </Container>
    </Form>
  )
}

NewSelfAssessmentFormPage.propTypes = {
  selfAssessmentFormId: number.isRequired,
  translate: func.isRequired
}

export default withLocalize(NewSelfAssessmentFormPage)
