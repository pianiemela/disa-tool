import React from 'react'
import PropTypes from 'prop-types'

import Tasklist from './Tasklist'
import Matrix from '../matrix/Matrix'

const EditTasksTab = props => (
  <div className="EditTasksTab">
    <Matrix editing={false} />
    <Tasklist
      courseId={props.courseId}
      editing
    />
  </div>
)

EditTasksTab.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditTasksTab
