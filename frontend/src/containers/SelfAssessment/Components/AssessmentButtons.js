import React from 'react'
import { Button, Form } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'

const AssessmentButtons = (props) => {
  const { onClick, value } = props
  const translate = id => props.translate(`SelfAssessment.AssessmentButtons.${id}`)
  return (
    <div>
      <Form.Field>
        <Button
          size="tiny"
          toggle
          type="button"
          assessment="category"
          id={value}
          onClick={onClick}
        >
          {translate('categoryButton')}
        </Button>
        <Button
          size="tiny"
          toggle
          type="button"
          assessment="objective"
          id={value}
          onClick={onClick}
        >
          {translate('objectiveButton')}
        </Button>
      </Form.Field>
    </div>
  )
}

AssessmentButtons.defaultProps = {
  value: -1
}
AssessmentButtons.propTypes = {
  translate: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  value: PropTypes.number

}

export default withLocalize(AssessmentButtons)
