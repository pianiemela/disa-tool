import React from 'react'
import { Message } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { withLocalize } from 'react-localize-redux'



const AssessmentMessage = (props) => {
  const { preview, open, edit, existingAnswer, translate } = props
  if (preview) {
    return <Message style={{ textAlign: 'center' }} color="green">{translate('previewMessage')}</Message>
  }
  if (!open && !edit) {
    return <Message style={{ textAlign: 'center' }} color="grey">{translate('notOpenMessage')}</Message>
  }

  if (open && existingAnswer) {
    return <Message style={{ textAlign: 'center' }} color="green">{translate('existingResponse')}</Message>
  }
  return null
}


AssessmentMessage.propTypes = {
  preview: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  existingAnswer: PropTypes.bool.isRequired,
  translate: PropTypes.func.isRequired,
  edit: PropTypes.bool.isRequired
}

export default AssessmentMessage
