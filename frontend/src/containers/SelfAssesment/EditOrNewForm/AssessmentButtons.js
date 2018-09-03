import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'

const AssessmentButtons = (props) => {
  const { sendFormId, selectedView, category, objectives } = props
  const translate = id => props.translate(`SelfAssessment.EditOrNewForm.AssessmentButtons.${id}`)

  return (
    <div>
      <Form.Field>
        <Button
          size="tiny"
          type="button"
          value={category}
          active={category === selectedView}
          toggle
          onClick={() => sendFormId('create', 'category', null)}
        >
          {translate('categoryButton')}
        </Button>
        <Button
          size="tiny"
          type="button"
          value={objectives}
          active={objectives === selectedView}
          toggle
          onClick={() => sendFormId('create', 'objectives', null)}
        >
          {translate('objectiveButton')}
        </Button>
      </Form.Field>
    </div>
  )
}

AssessmentButtons.propTypes = {
  selectedView: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  objectives: PropTypes.string.isRequired,
  sendFormId: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

export default withLocalize(AssessmentButtons)
