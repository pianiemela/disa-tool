import React, { useState } from 'react'
import { number } from 'prop-types'
import { Button } from 'semantic-ui-react'
import { createSelfAssessment } from '../../actions/selfAssessmentForm'

const INITIAL_DATA = {
  eng_name: '',
  fin_name: '',
  swe_name: '',
  eng_instructions: '',
  fin_instructions: '',
  swe_instructions: '',
  type: 'CATEGORIES',
  open: false,
  active: false,
  show_feedback: false
}

const SelfAssessmentFormCreateForm = ({
  courseInstanceId
}) => {
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState(null)
  const create = () => {
    setLoading(true)
    createSelfAssessment({
      ...INITIAL_DATA,
      course_instance_id: courseInstanceId
    }).then(({ created }) => {
      setRedirect(`/self-assessment-form/edit/${created.id}`)
    })
  }
  if (redirect) return <div>{redirect}</div>
  if (loading) return <div>Loading...</div>
  return (
    <Button onClick={create}>translate: Create</Button>
  )
}

SelfAssessmentFormCreateForm.propTypes = {
  courseInstanceId: number.isRequired
}

export default SelfAssessmentFormCreateForm
