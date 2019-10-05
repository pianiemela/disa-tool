import React from 'react'
import { Button, Popup } from 'semantic-ui-react'
import { withLocalize } from 'react-localize-redux'
import ReactMarkdown from 'react-markdown/with-html'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const InfoBox = ({
  translationid,
  buttonProps,
  popupProps,
  translate,
  translateFunc,
  user,
  courseInstance,
  useCourseRole
}) => {
  // modals cannot use translate, so they must pass translate as translateFunc prop to InfoBox
  const translationFunction = translateFunc || translate

  const isTeacher = useCourseRole
    ? courseInstance.courseRole === 'TEACHER'
    : user.role === 'TEACHER'
  const isAdmin = user.role === 'ADMIN'
  const isStudent = !isTeacher && !isAdmin

  console.log(translationid, courseInstance.courseRole)

  const translateidStudent = `InfoBox.${translationid}.Student`
  const translateidTeacher = `InfoBox.${translationid}.Teacher`
  const textStudent = translationFunction(translateidStudent, null, {
    renderInnerHtml: false
  })
  const textTeacher = translationFunction(translateidTeacher, null, {
    renderInnerHtml: false
  })

  let text = isStudent ? textStudent : textTeacher

  if (!isAdmin && textStudent.match('missing translation')) return null
  if (isAdmin) {
    text = `<span style="color: gray;">${translateidStudent}</span><br />${textStudent}<br /><br /><span style="color: gray;">${translateidTeacher}</span><br />${textTeacher}`
  }

  return (
    <Popup
      wide="very"
      position="left center"
      trigger={<Button circular icon="info" {...buttonProps} />}
      content={<ReactMarkdown source={text} escapeHtml={false} />}
      {...popupProps}
    />
  )
}

InfoBox.propTypes = {
  translate: PropTypes.func.isRequired,
  translationid: PropTypes.string.isRequired,
  buttonProps: PropTypes.shape({}),
  popupProps: PropTypes.shape({}),
  courseInstance: PropTypes.shape({
  }),
  user: PropTypes.shape({
    role: PropTypes.string
  }).isRequired,
  translateFunc: PropTypes.func,
  useCourseRole: PropTypes.bool
}

InfoBox.defaultProps = {
  buttonProps: {},
  popupProps: {},
  courseInstance: {},
  translateFunc: null,
  useCourseRole: false
}

const mapStatetoProps = state => ({
  user: state.user,
  courseInstance: state.instance
})

export default withLocalize(connect(mapStatetoProps)(InfoBox))
