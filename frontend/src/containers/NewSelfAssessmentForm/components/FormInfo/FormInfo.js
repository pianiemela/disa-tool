import React from 'react'
import { func } from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import MultilingualField from '../../../../utils/components/MultilingualField'

const FormInfo = ({
  selfAssessmentForm,
  setSelfAssessmentForm,
  ...props
}) => {
  const translate = id => props.translate(`NewSelfAssessmentForm.FormInfo.${id}`)
  const name = {
    eng: selfAssessmentForm.eng_name,
    fin: selfAssessmentForm.fin_name,
    swe: selfAssessmentForm.swe_name
  }
  const instructions = {
    eng: selfAssessmentForm.eng_instructions,
    fin: selfAssessmentForm.fin_instructions,
    swe: selfAssessmentForm.swe_instructions
  }
  const onNameChange = nameValues => setSelfAssessmentForm({
    ...selfAssessmentForm,
    eng_name: nameValues.eng,
    fin_name: nameValues.fin,
    swe_name: nameValues.swe
  })
  const onInstructionsChange = instructionsValues => setSelfAssessmentForm({
    ...selfAssessmentForm,
    eng_instructions: instructionsValues.eng,
    fin_instructions: instructionsValues.fin,
    swe_instructions: instructionsValues.swe
  })

  return (
    <div>
      <MultilingualField
        values={name}
        multilingual
        field="name"
        fieldDisplay={translate('name')}
        onChange={onNameChange}
      />
      <MultilingualField
        values={instructions}
        field="instructions"
        fieldDisplay={translate('instructions')}
        onChange={onInstructionsChange}
      />
    </div>
  )
}

FormInfo.propTypes = {
  translate: func.isRequired
}

export default withLocalize(FormInfo)
