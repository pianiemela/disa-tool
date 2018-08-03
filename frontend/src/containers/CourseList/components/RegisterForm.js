import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'semantic-ui-react'
import asyncAction from '../../../utils/asyncAction'

import { registerToCourse, unregisterFromCourse } from '../actions/coursePersons'

class RegisterForm extends PureComponent {
  render() {
    return (
      <Button
        className="RegisterForm"
        onClick={() => this.props.action({ course_instance_id: this.props.instanceId })}
        inverted
        color="blue"
      >
        {this.props.registered ? 'Peru rekisteröityminen' : 'Rekisteröidy'}
      </Button>
    )
  }
}

RegisterForm.propTypes = {
  registered: PropTypes.bool.isRequired,
  instanceId: PropTypes.number.isRequired,
  action: PropTypes.func.isRequired
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  action: ownProps.registered ? (
    asyncAction(unregisterFromCourse, dispatch)
  ) : (
    asyncAction(registerToCourse, dispatch)
  )
})

export default connect(null, mapDispatchToProps)(RegisterForm)
