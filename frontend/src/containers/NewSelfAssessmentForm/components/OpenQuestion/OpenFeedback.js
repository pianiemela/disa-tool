import React from 'react'
import { shape, func, string } from 'prop-types'
import { Card } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'

const OpenFeedback = ({
  openResponse,
  translate: baseTranslate
}) => {
  const translate = id => baseTranslate(`NewSelfAssessmentForm.OpenQuestion.OpenFeedback.${id}`)
  return (
    <Card fluid color="red" >
      <Card.Content>
        <Card.Header textAlign="center">
          <h3>{openResponse.prompt}</h3>
        </Card.Header>
        <Card.Description textAlign="center">
          <div>
            <h5>{translate('response')}:</h5>
            <p>{openResponse.text}</p>
          </div>

        </Card.Description>
      </Card.Content>
    </Card>
  )
}

OpenFeedback.propTypes = {
  openResponse: shape({
    prompt: string.isRequired,
    text: string.isRequired
  }).isRequired,
  translate: func.isRequired
}

export default withLocalize(OpenFeedback)
