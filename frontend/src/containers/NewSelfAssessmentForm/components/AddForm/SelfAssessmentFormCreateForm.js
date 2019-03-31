import React, { useState } from 'react'
import { number, func, string } from 'prop-types'
import { Button, Loader } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import { Redirect } from 'react-router-dom'
import { createSelfAssessment } from '../../actions/selfAssessmentForm'

const INITIAL_DATA = {
  eng_name: '',
  fin_name: '',
  swe_name: '',
  eng_instructions: '',
  fin_instructions: '',
  swe_instructions: '',
  open: false,
  active: false,
  show_feedback: false
}

const SelfAssessmentFormCreateForm = ({
  courseInstanceId,
  translate: baseTranslate,
  type
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.AddForm.SelfAssessmentFormCreateForm.${id}`)
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(null)
  const create = () => {
    setLoading(true)
    createSelfAssessment({
      ...INITIAL_DATA,
      type,
      course_instance_id: courseInstanceId
    }).then(({ created }) => {
      setRedirect(`/self-assessment-form/${created.id}/edit`)
    })
  }
  if (redirect) return <Redirect to={redirect} />
  if (loading) return <Loader active inline />
  return (
    <Button
      onClick={create}
      basic
      color="blue"
      content={(
        type === 'OBJECTIVES'
          ? translate('create_self_assessment_objective')
          : translate('create_self_assessment_category')
      )}
      icon="plus"
      circular
      style={{ marginLeft: '10px' }}
    />
  )
}

SelfAssessmentFormCreateForm.propTypes = {
  courseInstanceId: number.isRequired,
  translate: func.isRequired,
  type: string.isRequired
}

export default withLocalize(SelfAssessmentFormCreateForm)
