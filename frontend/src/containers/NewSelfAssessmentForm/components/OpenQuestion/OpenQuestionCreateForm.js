import React, { useState } from 'react'
import { number, func } from 'prop-types'
import { Button, Card } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import MultilingualField from '../../../../utils/components/MultilingualField'
import { createOpenQuestion } from '../../actions/openQuestion'

const INITIAL_PROMPT = {
  eng: '',
  fin: '',
  swe: ''
}

const OpenQuestionCreateForm = ({
  selfAssessmentFormId,
  translate: baseTranslate,
  dispatchQuestions
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.OpenQuestion.OpenQuestionCreateForm.${id}`)
  const [prompt, setPrompt] = useState(INITIAL_PROMPT)

  const addQuestion = () => {
    createOpenQuestion({
      self_assessment_form_id: selfAssessmentFormId,
      eng_prompt: prompt.eng,
      fin_prompt: prompt.fin,
      swe_prompt: prompt.swe,
      order: 1
    }).then(({ created }) => {
      // TODO: Optimism
      dispatchQuestions({
        type: 'CREATE',
        created
      })
    })
  }
  return (
    <Card fluid>
      <Card.Content>
        <MultilingualField
          field="prompt"
          fieldDisplay={translate('prompt')}
          onChange={setPrompt}
        />
        <Button
          type="button"
          onClick={addQuestion}
        >
          {translate('add')}
        </Button>
      </Card.Content>
    </Card>
  )
}

OpenQuestionCreateForm.propTypes = {
  selfAssessmentFormId: number.isRequired,
  translate: func.isRequired,
  dispatchQuestions: func.isRequired
}

export default withLocalize(OpenQuestionCreateForm)
