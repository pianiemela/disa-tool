import React from 'react'
import { func, shape, number, string } from 'prop-types'
import { withLocalize } from 'react-localize-redux'
import MultilingualField from '../../../../utils/components/MultilingualField'
import useSave from '../../../../utils/hooks/useSave'
import { editSelfAssessmentForm } from '../../actions/selfAssessmentForm'

const FormInfo = ({
  selfAssessmentForm,
  setSelfAssessmentForm,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.FormInfo.FormInfo.${id}`)
  const saveChanges = useSave(() => {
    editSelfAssessmentForm(selfAssessmentForm.id, selfAssessmentForm)
  })
  const onNameChange = ({ eng, fin, swe }) => {
    setSelfAssessmentForm({
      ...selfAssessmentForm,
      eng_name: eng,
      fin_name: fin,
      swe_name: swe
    })
    saveChanges()
  }
  const onInstructionsChange = ({ eng, fin, swe }) => {
    setSelfAssessmentForm({
      ...selfAssessmentForm,
      eng_instructions: eng,
      fin_instructions: fin,
      swe_instructions: swe
    })
    saveChanges()
  }

  return (
    <div>
      <MultilingualField
        values={{
          eng: selfAssessmentForm.eng_name,
          fin: selfAssessmentForm.fin_name,
          swe: selfAssessmentForm.swe_name
        }}
        multilingual
        field="name"
        fieldDisplay={translate('name')}
        onChange={onNameChange}
      />
      <MultilingualField
        values={{
          eng: selfAssessmentForm.eng_instructions,
          fin: selfAssessmentForm.fin_instructions,
          swe: selfAssessmentForm.swe_instructions
        }}
        field="instructions"
        fieldDisplay={translate('instructions')}
        onChange={onInstructionsChange}
      />
    </div>
  )
}

FormInfo.propTypes = {
  selfAssessmentForm: shape({
    id: number.isRequired,
    eng_name: string.isRequired,
    fin_name: string.isRequired,
    swe_name: string.isRequired,
    eng_instructions: string.isRequired,
    fin_instructions: string.isRequired,
    swe_instructions: string.isRequired
  }).isRequired,
  setSelfAssessmentForm: func.isRequired,
  translate: func.isRequired
}

export default withLocalize(FormInfo)
