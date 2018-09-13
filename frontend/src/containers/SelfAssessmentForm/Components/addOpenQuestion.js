import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import ModalForm, { saveActions } from '../../../utils/components/ModalForm'
import { addOpenQuestion } from '../actions/selfAssesment'
import MultilingualField from '../../../utils/components/MultilingualField'

const AddOpenQuestion = (props) => {
  const translate = id => props.translate(`SelfAssessmentForm.addOpenQuestion.${id}`)

  const createQuestion = e =>
    props.dispatchAddOpenQuestion({
      eng_name: e.target.eng_name.value,
      fin_name: e.target.fin_name.value,
      swe_name: e.target.swe_name.value
    })

  return (
    <ModalForm
      header={translate('addButton')}
      trigger={<span><Button positive>{translate('addButton')}</Button></span>}
      actions={saveActions(translate)}
      onSubmit={createQuestion}
    >
      <MultilingualField
        field="name"
        fieldDisplay={translate('questionDisplay')}
      />
    </ModalForm>
  )
}

const mapDispatchToProps = dispatch => ({
  dispatchAddOpenQuestion: questionData =>
    dispatch(addOpenQuestion(questionData))
})

AddOpenQuestion.propTypes = {
  dispatchAddOpenQuestion: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

export default withLocalize(connect(null, mapDispatchToProps)(AddOpenQuestion))
