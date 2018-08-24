import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'

const AssessmentButtons = (props) => {
  const { sendFormId, selectedView, category, objectives } = props
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
          Itsearviolomake kategorioiden pohjalta
        </Button>
        <Button
          size="tiny"
          type="button"
          value={objectives}
          active={objectives === selectedView}
          toggle
          onClick={() => sendFormId('create', 'objectives', null)}
        >
          Itsearviolomake tavoitteiden pohjalta
        </Button>
      </Form.Field>
    </div>
  )
}

AssessmentButtons.propTypes = {
  selectedView: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  objectives: PropTypes.string.isRequired,
  sendFormId: PropTypes.func.isRequired
}

export default AssessmentButtons
