import React from 'react'
import { Button, Popup } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import ReactMarkdown from 'react-markdown/with-html'
import PropTypes from 'prop-types'

const InfoBox = ({ translationid, buttonProps, popupProps, translate }) => (
  <Popup
    on="click"
    wide="very"
    position="left center"
    trigger={<Button circular icon="info" {...buttonProps} />}
    content={<ReactMarkdown
      source={translate(`InfoBox.${translationid}`, null, { renderInnerHtml: false })}
      escapeHtml={false}
    />}
    {...popupProps}
  />
)

InfoBox.propTypes = {
  translate: PropTypes.func.isRequired,
  translationid: PropTypes.string.isRequired,
  buttonProps: PropTypes.shape({}),
  popupProps: PropTypes.shape({})
}

InfoBox.defaultProps = {
  buttonProps: {},
  popupProps: {}
}

export default withLocalize(InfoBox)
