import React from 'react'
import PropTypes from 'prop-types'

import Tasklist from './components/tasks/Tasklist'
import Matrix from '../EditMatrix/components/matrix/Matrix'

const EditTasksPage = props => (
  <div className="EditTasksPage">
    <Matrix editing={false} />
    <Tasklist
      courseId={props.courseId}
      editing
    />
  </div>
)

EditTasksPage.propTypes = {
  courseId: PropTypes.number.isRequired
}

export default EditTasksPage
