import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withLocalize } from 'react-localize-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../utils/asyncAction'

import { registerToCourse, unregisterFromCourse } from '../actions/coursePersons'

const RegisterForm = (props) => {
  const translate = id => props.translate(`CourseList.RegisterForm.${id}`)

  return (
    <Button
      className="RegisterForm"
      onClick={() => props.action({ course_instance_id: props.instanceId })}
      inverted
      color="blue"
    >
      {props.registered ? translate('unregister') : translate('register')}
    </Button>
  )
}

RegisterForm.propTypes = {
  registered: PropTypes.bool.isRequired,
  instanceId: PropTypes.number.isRequired,
  action: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  action: ownProps.registered ? (
    asyncAction(unregisterFromCourse, dispatch)
  ) : (
    asyncAction(registerToCourse, dispatch)
  )
})

export default withLocalize(connect(null, mapDispatchToProps)(RegisterForm))
