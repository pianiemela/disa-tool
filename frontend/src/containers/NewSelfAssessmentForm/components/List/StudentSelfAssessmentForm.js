import React, { useState, useEffect } from 'react'
import { shape, func, number, string, bool } from 'prop-types'
import { List, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { withLocalize } from 'react-localize-redux'
import { getLanguage } from '../../../../utils/utils'
import { getResponse } from '../../actions/response'

const StudentSelfAssessmentForm = ({
  selfAssessmentForm,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.List.StudentSelfAssessmentForm.${id}`)
  const lang = getLanguage()
  const [response, setResponse] = useState(null)
  useEffect(() => {
    getResponse(selfAssessmentForm.id).then(({ data }) => {
      setResponse(data)
    })
  }, [])

  return (
    <List.Item style={{ display: 'flex' }}>
      <List.Content
        as={Link}
        to={`/self-assessment-form/${selfAssessmentForm.id}/response`}
        style={{ flexGrow: 1 }}
      >
        {selfAssessmentForm[`${lang}_name`]}
      </List.Content>
      <List.Content floated="right">
        <Label
          color={selfAssessmentForm.open ? 'green' : 'red'}
          content={selfAssessmentForm.open ? translate('open') : translate('closed')}
        />
        <Label
          color={response ? 'green' : 'red'}
          content={response ? translate('answered') : translate('unanswered')}
        />
      </List.Content>
    </List.Item>
  )
}

StudentSelfAssessmentForm.propTypes = {
  selfAssessmentForm: shape({
    id: number.isRequired,
    eng_name: string.isRequired,
    fin_name: string.isRequired,
    swe_name: string.isRequired,
    open: bool.isRequired
  }).isRequired,
  translate: func.isRequired
}

export default withLocalize(StudentSelfAssessmentForm)
