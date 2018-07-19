import React from 'react'
import PropTypes from 'prop-types'

import Tasklist from './components/tasks/Tasklist'

const EditTasksPage = props => (
  <div className="EditTasksPage">
    <Tasklist courseId={props.courseId} editing />
  </div>
)

EditTasksPage.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditTasksPage
