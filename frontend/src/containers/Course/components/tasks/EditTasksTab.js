import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { changeActive } from '../../actions/tasks'

import Tasklist from './Tasklist'
import Matrix from '../matrix/Matrix'
import Headerlist from '../types/Headerlist'

class EditTasksTab extends PureComponent {
  componentWillUnmount() {
    this.props.changeActive(null)
  }

  render() {
    return (
      <div className="EditTasksTab">
        <Matrix editing={false} />
        <Headerlist
          courseId={this.props.courseId}
          editing={false}
        />
        <Tasklist
          courseId={this.props.courseId}
          editing
        />
      </div>
    )
  }
}

EditTasksTab.propTypes = {
  courseId: PropTypes.number.isRequired,
  changeActive: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => ({
  changeActive: changeActive(dispatch)
})

export default connect(null, mapDispatchToProps)(EditTasksTab)
