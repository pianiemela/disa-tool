import React from 'react'
import { func, shape, string } from 'prop-types'
import { Header, Card } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import { getLanguage } from '../../../../utils/utils'

const ResponseFormInfo = ({
  selfAssessmentForm,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.FormInfo.ResponseFormInfo.${id}`)
  const lang = getLanguage()
  return (

    <div>
      <Header>{selfAssessmentForm[`${lang}_name`]}</Header>
      <Card fluid>
        <Card.Header>
          <Header>{translate('instructions')}</Header>
        </Card.Header>
        <Card.Content>
          <p>{selfAssessmentForm[`${lang}_instructions`]}</p>
        </Card.Content>
      </Card>
    </div>
  )
}

ResponseFormInfo.propTypes = {
  selfAssessmentForm: shape({
    eng_name: string.isRequired,
    fin_name: string.isRequired,
    swe_name: string.isRequired,
    eng_instructions: string.isRequired,
    fin_instructions: string.isRequired,
    swe_instructions: string.isRequired
  }).isRequired,
  translate: func.isRequired
}

export default withLocalize(ResponseFormInfo)
