import React from 'react'
import { Button, Popup } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import ReactMarkdown from 'react-markdown/with-html'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const InfoBox = ({ translationid, buttonProps, popupProps, translate, user}) => {
  const isTeacher = user.role === 'TEACHER'
  const isAdmin = user.role === 'ADMIN'
  const isStudent = !isTeacher && !isAdmin

  const translateidStudent = `InfoBox.${translationid}.Student`
  const translateidTeacher = `InfoBox.${translationid}.Teacher`
  let text = translate(
    isStudent ? translateidStudent : translateidTeacher,
    null,
    { renderInnerHtml: false }
  )
  const noText = text.match('missing translation')

  if (!isAdmin && noText) return null
  if (isAdmin) text = `<span style="color: gray;">${translateidStudent}<br />${translateidTeacher}</span><br /><br />${text}`

  return (
    <Popup
      wide="very"
      position="left center"
      trigger={<Button circular icon="info" {...buttonProps} />}
      content={<ReactMarkdown
        source={text}
        escapeHtml={false}
      />}
      {...popupProps}
    />
  )
}

InfoBox.propTypes = {
  translate: PropTypes.func.isRequired,
  translationid: PropTypes.string.isRequired,
  buttonProps: PropTypes.shape({}),
  popupProps: PropTypes.shape({}),
  course: PropTypes.shape({
  }),
  user: PropTypes.shape({
    role: PropTypes.string
  }).isRequired
}

InfoBox.defaultProps = {
  buttonProps: {},
  popupProps: {},
  course: {}
}

const mapStatetoProps = state => ({
  user: state.user
})

export default withLocalize(connect(mapStatetoProps)(InfoBox))
