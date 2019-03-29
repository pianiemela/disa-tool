import React from 'react'
import { shape, number, func, string } from 'prop-types'
import { Card, Header, Button } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import {
  editOpenQuestion,
  deleteOpenQuestion
} from '../../actions/openQuestion'
import MultilingualField from '../../../../utils/components/MultilingualField'
import useSave from '../../../../utils/hooks/useSave'

const OpenQuestion = ({
  question,
  translate: baseTranslate,
  dispatchQuestions
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.OpenQuestion.OpenQuestion.${id}`)
  const saveChanges = useSave((edited) => {
    editOpenQuestion(question.id, edited)
  })

  const onPromptChange = ({ eng, fin, swe }) => {
    const edited = {
      ...question,
      eng_prompt: eng,
      fin_prompt: fin,
      swe_prompt: swe
    }
    dispatchQuestions({
      type: 'UPDATE',
      edited
    })
    saveChanges(edited)
  }
  const removeQuestion = () => {
    dispatchQuestions({
      type: 'DELETE',
      deleted: question
    })
    deleteOpenQuestion(question.id)
  }

  return (
    <Card fluid>
      <Card.Header>
        <Header>{translate('card_header')}</Header>
      </Card.Header>
      <Card.Content>
        <Button
          type="button"
          onClick={removeQuestion}
        >
          {translate('delete')}
        </Button>
        <MultilingualField
          values={{
            eng: question.eng_prompt || '',
            fin: question.fin_prompt || '',
            swe: question.swe_prompt || ''
          }}
          field="prompt"
          fieldDisplay={translate('prompt')}
          onChange={onPromptChange}
        />
      </Card.Content>
    </Card>
  )
}

OpenQuestion.propTypes = {
  question: shape({
    id: number.isRequired,
    eng_prompt: string.isRequired,
    fin_prompt: string.isRequired,
    swe_prompt: string.isRequired
  }).isRequired,
  translate: func.isRequired,
  dispatchQuestions: func.isRequired
}

export default withLocalize(OpenQuestion)
