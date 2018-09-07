import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../utils/asyncAction'

import { registerToCourse, unregisterFromCourse } from '../actions/coursePersons'

const RegisterForm = (props) => {
  const translate = id => props.translate(`CourseList.RegisterForm.${id}`)

  if (props.user.id) {
    return (
      <Button
        className="RegisterForm"
        onClick={() => props.registerAction({ course_instance_id: props.instanceId })}
        inverted
        color="blue"
      >
        {props.registered ? translate('unregister') : translate('register')}
      </Button>
    )
  }
  return (
    <Button
      as={Link}
      to={`/courses/register?course=${props.courseId}&instance=${props.instanceId}`}
      className="RegisterForm"
      inverted
      color="blue"
    >
      {`${translate('register')} (${translate('require_login')})`}
    </Button>
  )
}

RegisterForm.propTypes = {
  registered: PropTypes.string,
  courseId: PropTypes.number.isRequired,
  instanceId: PropTypes.number.isRequired,
  registerAction: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.number
  }).isRequired
}

RegisterForm.defaultProps = {
  registered: null
}

const mapStateToProps = state => ({
  user: state.user
})

const mapDispatchToProps = (dispatch, ownProps) => ({
  registerAction: ownProps.registered ? (
    asyncAction(unregisterFromCourse, dispatch)
  ) : (
    asyncAction(registerToCourse, dispatch)
  )
})

export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(RegisterForm))
