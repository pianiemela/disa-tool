import React from 'react'
import { shape, string } from 'prop-types'
import { Header } from 'semantic-ui-react'
import { getLanguage } from '../../../../utils/utils'

const FeedbackFormInfo = ({
  selfAssessmentForm
}) => {
  const lang = getLanguage()
  return (
    <div>
      <Header as="h2">{selfAssessmentForm[`${lang}_name`] || ''}</Header>
    </div>
  )
}

FeedbackFormInfo.propTypes = {
  selfAssessmentForm: shape({
    eng_name: string,
    fin_name: string,
    swe_name: string
  }).isRequired
}

export default FeedbackFormInfo
